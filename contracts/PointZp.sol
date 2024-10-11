// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./field/bigFiniteField.sol";

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

    function newPoint(PointType pointType, Zp memory x, Zp memory y) public pure returns (Point_Zp memory) {
        return Point_Zp(pointType, x, y);
    }

    function add(Point_Zp memory self, Point_Zp memory other) public view returns (Point_Zp memory) {
        if (self.pointType == PointType.PointAtInfinity) return self;
        if (other.pointType == PointType.PointAtInfinity) return other;
        if (f.equals(self.x, other.x) && f.equals(self.y, other.y)) return double(self);
        if (f.equals(self.x, other.x) && !f.equals(self.y, other.y)) return newPoint(PointType.PointAtInfinity, f.zero(), f.zero());
        Zp memory l = f.mul(f.sub(other.y, self.y), f.inverse(f.sub(other.x, self.x)));
        Zp memory x_n = f.sub(f.sub(f.mul(l, l), self.x), other.x);
        Zp memory y_n = f.sub(f.mul(f.sub(self.x, x_n), l), self.y);
        return newPoint(PointType.Affine, x_n, y_n);
    }

    function double(Point_Zp memory self) public view returns (Point_Zp memory) {
        if (f.equals(self.y, f.zero())) return newPoint(PointType.PointAtInfinity, f.zero(), f.zero());
        Zp memory l = f.mul(f.mul(f.three(), f.mul(self.x, self.x)), f.inverse(f.mul(f.two(), self.y)));
        Zp memory x_n = f.sub(f.sub(f.mul(l, l), self.x), self.x);
        Zp memory y_n = f.sub(f.mul(f.sub(self.x, x_n), l), self.y);
        return newPoint(PointType.Affine, x_n, y_n);
    }

    function negate(Point_Zp memory self) public view returns (Point_Zp memory) {
        require(self.pointType != PointType.PointAtInfinity, "cannot negate point at infinity");
        return newPoint(PointType.Affine, self.x, f.sub(f.zero(), self.y));
    }

    function multiply(Point_Zp memory self, BigNumber memory k) public view returns (Point_Zp memory) {

    }

}