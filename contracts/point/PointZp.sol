// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../field/bigFiniteField.sol";

enum PointType {
    Affine,
    PointAtInfinity
}

struct Point_Zp {
    PointType pointType;
    Zp x;
    Zp y;
}

contract PointZp {
    BigFiniteField private f;

    constructor(BigFiniteField field) {
        f = field;
    }

    function newPoint(
        Zp memory x,
        Zp memory y
    ) public pure returns (Point_Zp memory) {
        return Point_Zp(PointType.Affine, x, y);
    }

    function point_at_infinity() public view returns (Point_Zp memory) {
        return Point_Zp(PointType.PointAtInfinity, f.zero(), f.zero());
    }

    function add(
        Point_Zp memory self,
        Point_Zp memory other
    ) public view returns (Point_Zp memory) {
        if (self.pointType == PointType.PointAtInfinity) return other;
        if (other.pointType == PointType.PointAtInfinity) return self;
        if (f.equals(self.x, other.x) && f.equals(self.y, other.y))
            return double(self);
        if (f.equals(self.x, other.x) && !f.equals(self.y, other.y))
            return point_at_infinity();
        Zp memory l = f.mul(
            f.sub(other.y, self.y),
            f.inverse(f.sub(other.x, self.x))
        );
        Zp memory x_n = f.sub(f.sub(f.mul(l, l), self.x), other.x);
        Zp memory y_n = f.sub(f.mul(f.sub(self.x, x_n), l), self.y);
        return newPoint(x_n, y_n);
    }

    function double(
        Point_Zp memory self
    ) public view returns (Point_Zp memory) {
        if (f.equals(self.y, f.zero())) return point_at_infinity();
        Zp memory l = f.mul(
            f.mul(f.three(), f.mul(self.x, self.x)),
            f.inverse(f.mul(f.two(), self.y))
        );
        Zp memory x_n = f.sub(f.sub(f.mul(l, l), self.x), self.x);
        Zp memory y_n = f.sub(f.mul(f.sub(self.x, x_n), l), self.y);
        return newPoint(x_n, y_n);
    }

    function negate(
        Point_Zp memory self
    ) public view returns (Point_Zp memory) {
        require(
            self.pointType != PointType.PointAtInfinity,
            "cannot negate point at infinity"
        );
        return newPoint(self.x, f.sub(f.zero(), self.y));
    }

    function multiply(
        BigNumber memory k,
        Point_Zp memory self
    ) public view returns (Point_Zp memory) {
        Point_Zp memory acc = point_at_infinity();
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
        Point_Zp memory self,
        Point_Zp memory acc
    ) private view returns (Point_Zp memory) {
        if (BigNumbers.cmp(k, BigNumbers.zero(), false) == 0) return acc;
        if (BigNumbers.isOdd(k))
            return
                doubleAndAdd(
                    BigNumbers.shr(k, 1),
                    double(self),
                    add(acc, self)
                );
        return doubleAndAdd(BigNumbers.shr(k, 1), double(self), acc);
    }

    function compare(
        Point_Zp memory a,
        Point_Zp memory b
    ) public view returns (bool) {
        if (
            a.pointType == PointType.PointAtInfinity &&
            b.pointType == PointType.PointAtInfinity
        ) {
            return true;
        }
        if (
            a.pointType == PointType.Affine && b.pointType == PointType.Affine
        ) {
            return f.equals(a.x, b.x) && f.equals(a.y, b.y);
        }
        return false;
    }
}
