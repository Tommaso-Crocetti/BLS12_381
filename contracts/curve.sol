// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BigNumber.sol";
import "./field";
import "./point";

contract Curve {

    BigNumber private prime = BigNumbers.init__(0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab, false);
    BigNumber private order = BigNumbers.init__(0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001, false);
    BigFiniteField private fField = BigFiniteField(prime);
    QuadraticExtension private qField = quadraticExtension(fField);
    SexticExtension private sField = sexticExtension(qField);
    TwelveExtension private tField = twelveExtension(sField);
    PointZp private pZp = PointZp(fField);
    PointZp_2 private pZp_2 = PointZp_2(qField);
    PointZp_12 private pZp_12 = PointZp_12(tField);
    Point_Zp private g0 = pZp.newPoint(PointType.Affine, 
        fField.createElement(BigNumbers.init__(0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb, false)),
        fField.createElement(BigNumbers.init__(0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1, false))
        );
    Point_Zp_2 private g1 = pZp_2.newPoint(PointType.Affine,
        qField.createElement(
            fField.createElement(BigNumbers.init__(0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e, false)),
            fField.createElement(Bignumbers.init__(0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8, false))
        ),
        qField.createElement(
            fField.createElement(BigNumbers.init__(0x0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be, false)),
            fField.createElement(BigNumbers.init__(0x0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801, false))
        )
    );

    //definisco costruttore che inizializza prime order ecc? Ad ora valori standard + con formule maggiore complesita' (divisione per 3)
    constructor(bytes x, bool sign) {
    }

    function isOnCurve(
        Point_Zp memory p
    ) public view returns (bool) {
        if (p.pointType == PointType.PointAtInfinity) return false;
        Zp memory l = fField.mul(p.y, p.y);
        Zp memory r = fField.sum(
            fField.mul(fField.mul(p.x, p.x), p.x),
            fField.mul_nonres(fField.four())
        );
        return fField.equals(l, r);
    }

    function isOnCurve_1(
        QuadraticExtension q,
        Point_1 memory p
    ) public view returns (bool) {
        if (p.pointType == PointType.PointAtInfinity) return false;
        Zp_2 memory l = q.mul(p.y, p.y);
        Zp_2 memory r = q.sum(
            q.mul(q.mul(p.x, p.x), p.x),
            q.mul_nonres(q.createElement(Zp(BigNumbers.init(4, false)), fField.zero()))
        );
        return q.equals(l, r);
    }

    function untwist(Point_1 memory p) public view returns (Point_2 memory) {
        Zp_6 memory t0 = sField.createElement(
            qField.zero(),
            qField.createElement(fField.createElement(BigNumbers.one()), fField.zero()),
            qField.zero()
        );
        Zp_12 memory t1 = tField.createElement(
            sField.createElement(p.x, qField.zero(), qField.zero()),
            sField.zero()
        );
        Zp_12 memory t2 = tField.inverse(
            tField.createElement(sField.zero(), t0)
        );
        Zp_12 memory t3 = tField.createElement(
            sField.createElement(p.y, qField.zero(), qField.zero()),
            sField.zero()
        );
        Zp_12 memory t4 = tField.inverse(
            tField.createElement(t0, sField.zero())
        );

        return
            Point_2(PointType.Affine, tField.mul(t1, t2), tField.mul(t3, t4));
    }
}
