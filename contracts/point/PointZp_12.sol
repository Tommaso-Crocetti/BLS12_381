// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PointZp.sol";
import "../field/twelveExtension.sol";

struct Point_Zp_12 {
    PointType pointType;
    Zp_12 x;
    Zp_12 y;
}

contract PointZp_12 {
    TwelveExtension private t;

    constructor(TwelveExtension field) {
        t = field;
    }

    function newPoint(
        PointType pointType,
        Zp_12 memory x,
        Zp_12 memory y
    ) public pure returns (Point_Zp_12 memory) {
        return Point_Zp_12(pointType, x, y);
    }

    function add(
        Point_Zp_12 memory self,
        Point_Zp_12 memory other
    ) public view returns (Point_Zp_12 memory) {
        if (self.pointType == PointType.PointAtInfinity) return other;
        if (other.pointType == PointType.PointAtInfinity) return self;
        if (t.equals(self.x, other.x) && t.equals(self.y, other.y))
            return double(self);
        if (t.equals(self.x, other.x) && !t.equals(self.y, other.y))
            return newPoint(PointType.PointAtInfinity, t.zero(), t.zero());
        Zp_12 memory l = t.mul(
            t.sub(other.y, self.y),
            t.inverse(t.sub(other.x, self.x))
        );
        Zp_12 memory x_n = t.sub(t.sub(t.mul(l, l), self.x), other.x);
        Zp_12 memory y_n = t.sub(t.mul(t.sub(self.x, x_n), l), self.y);
        return newPoint(PointType.Affine, x_n, y_n);
    }

    function double(
        Point_Zp_12 memory self
    ) public view returns (Point_Zp_12 memory) {
        if (t.equals(self.y, t.zero()))
            return newPoint(PointType.PointAtInfinity, t.zero(), t.zero());
        Zp_12 memory l = t.mul(
            t.mul(t.three(), t.mul(self.x, self.x)),
            t.inverse(t.mul(t.two(), self.y))
        );
        Zp_12 memory x_n = t.sub(t.sub(t.mul(l, l), self.x), self.x);
        Zp_12 memory y_n = t.sub(t.mul(t.sub(self.x, x_n), l), self.y);
        return newPoint(PointType.Affine, x_n, y_n);
    }

    function negate(
        Point_Zp_12 memory self
    ) public view returns (Point_Zp_12 memory) {
        require(
            self.pointType != PointType.PointAtInfinity,
            "cannot negate point at infinity"
        );
        return newPoint(PointType.Affine, self.x, t.sub(t.zero(), self.y));
    }

    function multiply(
        BigNumber memory k,
        Point_Zp_12 memory self
    ) public view returns (Point_Zp_12 memory) {
        Point_Zp_12 memory acc = newPoint(
            PointType.PointAtInfinity,
            t.zero(),
            t.zero()
        );
        if (!k.neg) return doubleAndAdd(k, self, acc);
        else
            return
                doubleAndAdd(
                    BigNumbers.mul(k, BigNumbers.init(1, true)),
                    negate(self),
                    acc
                );
    }

    function doubleAndAdd(
        BigNumber memory k,
        Point_Zp_12 memory self,
        Point_Zp_12 memory acc
    ) private view returns (Point_Zp_12 memory) {
        if (BigNumbers.cmp(k, BigNumbers.zero(), false) == 0) return acc;
        if (BigNumbers.isOdd(k)) return doubleAndAdd(BigNumbers.shr(k, 1), double(self), add(acc, self));
        return doubleAndAdd(BigNumbers.shr(k, 1), double(self), acc);
    }
}
