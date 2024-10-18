// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./BigNumber.sol";
import "./field/bigFiniteField.sol";
import "./field/sexticExtension.sol";
import "./point/pointZp_2.sol";
import "./point/pointZp_12.sol";

contract Curve {
    BigNumber private prime =
        BigNumbers.init__(
            "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab",
            false
        );
    BigNumber private order =
        BigNumbers.init__(
            "0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001",
            false
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
                    "0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb",
                    false
                )
            ),
            fField.createElement(
                BigNumbers.init__(
                    "0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1",
                    false
                )
            )
        );
    Point_Zp_2 private g1 =
        pZp_2.newPoint(
            PointType.Affine,
            qField.createElement(
                fField.createElement(
                    BigNumbers.init__(
                        "0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e",
                        false
                    )
                ),
                fField.createElement(
                    BigNumbers.init__(
                        "0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8",
                        false
                    )
                )
            ),
            qField.createElement(
                fField.createElement(
                    BigNumbers.init__(
                        "0x0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be",
                        false
                    )
                ),
                fField.createElement(
                    BigNumbers.init__(
                        "0x0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801",
                        false
                    )
                )
            )
        );

    function get_g0() public view returns (Point_Zp memory) {
        return g0;
    }

    //costruttore per passare parametro per inizializzare i vari valori per ora fissi?

    //verifcare correttezza, specialmente isOnCurve_12
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
        if (point.pointType == PointType.PointAtInfinity) return false;
        Zp_2 memory l = qField.mul(point.y, point.y);
        Zp_2 memory r = qField.sum(
            qField.mul(qField.mul(point.x, point.x), point.x),
            qField.mul_nonres(qField.four())
        );
        return qField.equals(l, r);
    }

    function isOnCurve_12(Point_Zp_12 memory point) public view returns (bool) {
        if (point.pointType == PointType.PointAtInfinity) return false;
        Zp_12 memory l = tField.mul(point.y, point.y);
        Zp_12 memory r = tField.sum(
            tField.mul(tField.mul(point.x, point.x), point.x),
            tField.four()
        );
        return tField.equals(l, r);
    }

    //verificare correttezza, dovrebbe usare factor clearing
    function Subgroup_0Check(Point_Zp memory point) public view returns (bool) {
        return pZp.multiply(order, point).pointType == PointType.Affine;
    }

    function Subgroup_1Check(
        Point_Zp_2 memory point
    ) public view returns (bool) {
        return pZp_2.multiply(order, point).pointType == PointType.Affine;
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
                PointType.Affine,
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

    function miller(
        Point_Zp memory p,
        Point_Zp_12 memory q
    ) public view returns (Point_Zp_12 memory) {}
}
