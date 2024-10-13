// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./pointZp.sol";
import "../field/quadraticExtension.sol";

struct Point_Zp_2 {
    PointType pointType;
    Zp_2 x;
    Zp_2 y;
}

contract PointZp_2 {
    QuadraticExtension private q;

    constructor(QuadraticExtension field) {
        q = field;
    }

    function newPoint(
        PointType pointType,
        Zp_2 memory x,
        Zp_2 memory y
    ) public pure returns (Point_Zp_2 memory) {
        return Point_Zp_2(pointType, x, y);
    }

    function add(
        Point_Zp_2 memory self,
        Point_Zp_2 memory other
    ) public view returns (Point_Zp_2 memory) {
        if (self.pointType == PointType.PointAtInfinity) return other;
        if (other.pointType == PointType.PointAtInfinity) return self;
        if (q.equals(self.x, other.x) && q.equals(self.y, other.y))
            return double(self);
        if (q.equals(self.x, other.x) && !q.equals(self.y, other.y))
            return newPoint(PointType.PointAtInfinity, q.zero(), q.zero());
        Zp_2 memory l = q.mul(
            q.sub(other.y, self.y),
            q.inverse(q.sub(other.x, self.x))
        );
        Zp_2 memory x_n = q.sub(q.sub(q.mul(l, l), self.x), other.x);
        Zp_2 memory y_n = q.sub(q.mul(q.sub(self.x, x_n), l), self.y);
        return newPoint(PointType.Affine, x_n, y_n);
    }

    function double(
        Point_Zp_2 memory self
    ) public view returns (Point_Zp_2 memory) {
        if (q.equals(self.y, q.zero()))
            return newPoint(PointType.PointAtInfinity, q.zero(), q.zero());
        Zp_2 memory l = q.mul(
            q.mul(q.three(), q.mul(self.x, self.x)),
            q.inverse(q.mul(q.two(), self.y))
        );
        Zp_2 memory x_n = q.sub(q.sub(q.mul(l, l), self.x), self.x);
        Zp_2 memory y_n = q.sub(q.mul(q.sub(self.x, x_n), l), self.y);
        return newPoint(PointType.Affine, x_n, y_n);
    }

    function negate(
        Point_Zp_2 memory self
    ) public view returns (Point_Zp_2 memory) {
        require(
            self.pointType != PointType.PointAtInfinity,
            "cannot negate point at infinity"
        );
        return newPoint(PointType.Affine, self.x, q.sub(q.zero(), self.y));
    }

    function multiply(
        BigNumber memory k,
        Point_Zp_2 memory self
    ) public view returns (Point_Zp_2 memory) {
        Point_Zp_2 memory acc = newPoint(
            PointType.PointAtInfinity,
            q.zero(),
            q.zero()
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
        Point_Zp_2 memory self,
        Point_Zp_2 memory acc
    ) private view returns (Point_Zp_2 memory) {
        if (BigNumbers.cmp(k, BigNumbers.zero(), false) == 0) return acc;
        if (BigNumbers.isOdd(k)) return doubleAndAdd(BigNumbers.shr(k, 1), double(self), add(acc, self));
        return doubleAndAdd(BigNumbers.shr(k, 1), double(self), acc);
    }
}
