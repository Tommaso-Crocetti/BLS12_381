// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./BigNumber.sol";
import "./field/bigFiniteField.sol";
import "./field/sexticExtension.sol";
import "./point/pointZp.sol";
import "./point/pointZp_2.sol";
import "./point/pointZp_12.sol";

contract Curve {
    BigNumber private prime =
        BigNumbers.init__(
            hex"1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab",
            false
        );

    BigNumber private order =
        BigNumbers.init__(
            hex"73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001",            false
        );
    BigFiniteField private fField = new BigFiniteField(prime);
    QuadraticExtension private qField = new QuadraticExtension(fField);
    SexticExtension private sField = new SexticExtension(qField);
    TwelveExtension private tField = new TwelveExtension(sField);
    PointZp private pZp = new PointZp(fField);
    PointZp_2 private pZp_2 = new PointZp_2(qField);
    PointZp_12 private pZp_12 = new PointZp_12(tField);
    Point_Zp private g0 =
        pZp.newPoint(
            fField.createElement(
                BigNumbers.init__(
                    hex"17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb",
                    false
                )
            ),
            fField.createElement(
                BigNumbers.init__(
                    hex"08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1",
                    false
                )
            )
        );
    Point_Zp_2 private g1 =
        pZp_2.newPoint(
            qField.createElement(
                fField.createElement(
                    BigNumbers.init__(
                        hex"024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8",
                        false
                    )
                ),
                fField.createElement(
                    BigNumbers.init__(
                        hex"13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e",
                        false
                    )
                )
            ),
            qField.createElement(
                fField.createElement(
                    BigNumbers.init__(
                        hex"0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801",
                        false
                    )
                ),
                fField.createElement(
                    BigNumbers.init__(
                        hex"0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be",
                        false
                    )
                )
            )
        );

    function get_prime() public view returns (BigNumber memory) {
        return prime;
    }

    function get_order() public view returns (BigNumber memory){
        return order;
    }

    function get_g0() public view returns (Point_Zp memory) {
        return g0;
    }

    function get_g1() public view returns (Point_Zp_2 memory) {
        return g1;
    }

    function isOnCurve(Point_Zp memory point) public view returns (bool) {
        Zp memory l = fField.mul(point.y, point.y);
        Zp memory r = fField.sum(
            fField.mul(fField.mul(point.x, point.x), point.x),
            fField.mul_nonres(fField.four())
        );
        return fField.equals(l, r);
    }

    function isOnCurveTwist(
        Point_Zp_2 memory point
    ) public view returns (bool) {
        if (point.pointType == PointType_2.PointAtInfinity) return false;
        Zp_2 memory l = qField.mul(point.y, point.y);
        Zp_2 memory r = qField.sum(
            qField.mul(qField.mul(point.x, point.x), point.x),
            qField.mul_nonres(qField.four())
        );
        return qField.equals(l, r);
    }

    function isOnCurve_12(Point_Zp_12 memory point) public view returns (bool) {
        if (point.pointType == PointType_12.PointAtInfinity) return false;
        Zp_12 memory l = tField.mul(point.y, point.y);
        Zp_12 memory r = tField.sum(
            tField.mul(tField.mul(point.x, point.x), point.x),
            tField.four()
        );
        return tField.equals(l, r);
    }

    function Subgroup_0Check(Point_Zp memory point) public view returns (bool) {
        return pZp.multiply(order, point).pointType == PointType.Affine;
    }

    function Subgroup_1Check(
        Point_Zp_2 memory point
    ) public view returns (bool) {
        return pZp_2.multiply(order, point).pointType == PointType_2.Affine;
    }

    function untwist(
        Point_Zp_2 memory point
    ) public view returns (Point_Zp_12 memory) {
        Zp_6 memory a = sField.createElement(
            qField.zero(),
            qField.createElement(fField.one(), fField.zero()),
            qField.zero()
        );
        Zp_12 memory x = tField.createElement(
            sField.createElement(point.x, qField.zero(), qField.zero()),
            sField.zero()
        );
        Zp_12 memory y = tField.createElement(
            sField.createElement(point.y, qField.zero(), qField.zero()),
            sField.zero()
        );
        return
            pZp_12.newPoint(
                tField.mul(
                    x,
                    tField.inverse(tField.createElement(a, sField.zero()))
                ),
                tField.mul(
                    y,
                    tField.inverse(tField.createElement(sField.zero(), a))
                )
            );
    }

    function doubleEval(
        Point_Zp_2 memory r,
        Point_Zp memory p
    ) public view returns (Zp_12 memory) {
        Point_Zp_12 memory r_twist = untwist(r);
        Zp_12 memory slope = tField.mul(
            tField.mul(tField.mul(tField.three(), r_twist.x), r_twist.x),
            tField.inverse(tField.mul(tField.two(), r_twist.y))
        );
        Zp_12 memory v = tField.sub(r_twist.y, tField.mul(slope, r_twist.x));
        Zp_12 memory t0 = tField.fromZp(p.y);
        Zp_12 memory t1 = tField.mul(tField.fromZp(p.x), slope);
        return tField.sub(tField.sub(t0, t1), v);
    }

    function addEval(
        Point_Zp_2 memory r,
        Point_Zp_2 memory q,
        Point_Zp memory p
    ) public view returns (Zp_12 memory) {
        require(!qField.equals(r.x, q.x) && !qField.equals(r.y, q.y));
        Point_Zp_12 memory r_twist = untwist(r);
        Point_Zp_12 memory q_twist = untwist(q);
        if (
            tField.equals(r_twist.x, q_twist.x) &&
            !tField.equals(r_twist.y, q_twist.y)
        ) {
            return tField.sub(tField.fromZp(p.x), r_twist.x);
        } else {
            return _addEval(r_twist, q_twist, p);
        }
    }

    function _addEval(
        Point_Zp_12 memory r,
        Point_Zp_12 memory q,
        Point_Zp memory p
    ) public view returns (Zp_12 memory) {
        Zp_12 memory slope = tField.mul(
            tField.sub(q.y, r.y),
            tField.inverse(tField.sub(q.x, r.x))
        );
        Zp_12 memory v = tField.mul(
            tField.sub(tField.mul(q.y, r.x), tField.mul(r.y, q.x)),
            tField.inverse(tField.sub(r.x, q.x))
        );
        Zp_12 memory t0 = tField.fromZp(p.y);
        Zp_12 memory t1 = tField.mul(tField.fromZp(p.x), slope);
        return tField.sub(tField.sub(t0, t1), v);
    }

    function get_millerBits(
        BigNumber memory value
    ) public view returns (bool[] memory) {
        uint256 index = 0;

        bool[] memory bits = new bool[](value.bitlen);
        while (BigNumbers.gt(value, BigNumbers.zero())) {
            // Inserisce 'true' se l'ultimo bit è 1, altrimenti 'false'
            bits[index] = (BigNumbers.isOdd(value));
            // Shifta a destra di un bit
            value = BigNumbers.shr(value, 1);
            index++;
        }

        bool[] memory reversedBits = new bool[](index - 1);

        // Copiamo gli elementi nell'ordine inverso, escludendo quello più significativo
        for (uint256 i = 0; i < index - 1; i++) {
            reversedBits[i] = bits[index - i - 2]; // -2 per escludere il primo elemento
        }

        return reversedBits;
    }

    function miller(
        Point_Zp memory p,
        Point_Zp_2 memory q
    ) public view returns (Zp_12 memory) {
        return
            miller_iterate(
                p,
                q,
                q,
                get_millerBits(BigNumbers.init__(hex"d201000000010000", false))
            );
    }

    function miller_iterate(
        Point_Zp memory p,
        Point_Zp_2 memory q,
        Point_Zp_2 memory r,
        bool[] memory bits
    ) public view returns (Zp_12 memory) {
        Zp_12 memory acc = tField.one();
        for (uint256 i = 0; i < bits.length; i++) {
            tField.mul(acc, acc);
            tField.mul(acc, doubleEval(r, p));
            r = pZp_2.double(r);
            if (bits[i]) {
                tField.mul(acc, addEval(r, q, p));
                r = pZp_2.add(r, q);
            }
        }
        return acc;
    }

    function exp(Zp_12 memory value, BigNumber memory e) public view returns (Zp_12 memory) {
        if (BigNumbers.isZero(e)) {
            return tField.one();
        }
        Zp_12 memory result = tField.zero();
        Zp_12 memory current = value;
        bool[] memory bits = pZp.getBits(e);
        if (bits[0]) {
            result = current;
        }
        for (uint i = 1; i < bits.length; i++) {
            current = tField.mul(current, current);
            if (bits[i]) {
                result = tField.sum(result, current);
            }
        }
        return result;
    }

    function try_pairing(Zp_12 memory value) public view returns (Zp_12 memory) {
        BigNumber memory e0 = BigNumbers.add(BigNumbers.pow(prime, 2), BigNumbers.one());
        BigNumber memory e1 = BigNumbers.sub(BigNumbers.pow(prime, 6), BigNumbers.one());
        BigNumber memory e2 = BigNumbers.init__(hex"000f686b3d807d01c0bd38c3195c899ed3cde88eeb996ca394506632528d6a9a2f230063cf081517f68f7764c28b6f8ae5a72bce8d63cb9f827eca0ba621315b2076995003fc77a17988f8761bdc51dc2378b9039096d1b767f17fcbde783765915c97f36c6f18212ed0b283ed237db421d160aeb6a1e79983774940996754c8c71a2629b0dea236905ce937335d5b68fa9912aae208ccf1e516c3f438e3ba79", false);
        Zp_12 memory t0 = exp(value, e0);
        Zp_12 memory t1 = exp(value, e1);
        Zp_12 memory t2 = exp(value, e2);
        return tField.mul(tField.mul(t0, t1), t2);
    }

    function pairing(
        Point_Zp memory p,
        Point_Zp_2 memory q
    ) public view returns (Zp_12 memory) {
        if (
            p.pointType == PointType.PointAtInfinity ||
            q.pointType == PointType_2.PointAtInfinity
        ) return tField.zero();
        require (isOnCurve(p) && isOnCurveTwist(q));
        Zp_12 memory result = miller(p,q);
        BigNumber memory e0 = BigNumbers.add(BigNumbers.pow(prime, 2), BigNumbers.one());
        BigNumber memory e1 = BigNumbers.sub(BigNumbers.pow(prime, 6), BigNumbers.one());
        BigNumber memory e2 = BigNumbers.init__(hex"000f686b3d807d01c0bd38c3195c899ed3cde88eeb996ca394506632528d6a9a2f230063cf081517f68f7764c28b6f8ae5a72bce8d63cb9f827eca0ba621315b2076995003fc77a17988f8761bdc51dc2378b9039096d1b767f17fcbde783765915c97f36c6f18212ed0b283ed237db421d160aeb6a1e79983774940996754c8c71a2629b0dea236905ce937335d5b68fa9912aae208ccf1e516c3f438e3ba79", false);
        Zp_12 memory t0 = exp(result, e0);
        Zp_12 memory t1 = exp(result, e1);
        Zp_12 memory t2 = exp(result, e2);
        return tField.mul(tField.mul(t0, t1), t2);
    }
}
