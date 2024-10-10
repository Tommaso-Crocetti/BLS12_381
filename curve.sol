// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./field/finiteField.sol";
import "./field/quadraticExtension.sol";
import "./field/sexticExtension.sol";
import "./field/twelveExtension.sol";

contract Curve {
    enum PointType {
        Affine,
        PointAtInfinity
    }

    struct Point_0 {
        PointType pointType;
        Zp x;
        Zp y;
    }

    struct Point_1 {
        PointType pointType;
        Zp_2 x;
        Zp_2 y;
    }

    struct Point_2 {
        PointType pointType;
        Zp_12 x;
        Zp_12 y;
    }

    BigNumber private order;
    Point_0 private g0;
    Point_1 private g1;
    FiniteField private fField;
    QuadraticExtension private qField;
    SexticExtension private sField;
    TwelveExtension private tField;

    function isOnCurve_0(
        FiniteField f,
        Point_0 memory p
    ) public view returns (bool) {
        if (p.pointType == PointType.PointAtInfinity) return false;
        Zp memory l = f.mul(p.y, p.y);
        Zp memory r = f.sum(
            f.mul(f.mul(p.x, p.x), p.x),
            f.mul_nonres(f.createElement(4))
        );
        return f.equals(l, r);
    }

    function isOnCurve_1(
        QuadraticExtension q,
        Point_1 memory p
    ) public view returns (bool) {
        if (p.pointType == PointType.PointAtInfinity) return false;
        Zp_2 memory l = q.mul(p.y, p.y);
        Zp_2 memory r = q.sum(
            q.mul(q.mul(p.x, p.x), p.x),
            q.mul_nonres(q.createElement(Zp(4), fField.zero()))
        );
        return q.equals(l, r);
    }

    function untwist(Point_1 memory p) public view returns (Point_2 memory) {
        Zp_6 memory t0 = sField.createElement(
            qField.zero(),
            qField.createElement(fField.createElement(1), fField.zero()),
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
