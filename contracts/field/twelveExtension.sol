// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./sexticExtension.sol";

struct Zp_12 {
    Zp_6 a;
    Zp_6 b;
}

contract TwelveExtension {
    SexticExtension s;

    constructor(SexticExtension six) {
        s = six;
    }

    function createElement(
        Zp_6 memory x,
        Zp_6 memory y
    ) public pure returns (Zp_12 memory) {
        return Zp_12(x, y);
    }

    function sum(
        Zp_12 memory x,
        Zp_12 memory y
    ) public view returns (Zp_12 memory) {
        return createElement(s.sum(x.a, y.a), s.sum(x.b, y.b));
    }

    function sub(
        Zp_12 memory x,
        Zp_12 memory y
    ) public view returns (Zp_12 memory) {
        return createElement(s.sub(x.a, y.a), s.sub(x.b, y.b));
    }

    function mul(
        Zp_12 memory x,
        Zp_12 memory y
    ) public view returns (Zp_12 memory) {
        Zp_6 memory t0 = s.mul_nonres(s.mul(x.b, y.b));
        Zp_6 memory t1 = s.mul(x.a, y.a);
        Zp_6 memory t2 = s.mul(x.b, y.a);
        Zp_6 memory t3 = s.mul(x.a, y.b);
        return createElement(s.sum(t0, t1), s.sum(t2, t3));
    }

    function inverse(Zp_12 memory x) public view returns (Zp_12 memory) {
        Zp_6 memory t0 = s.mul_nonres(s.mul(x.b, x.b));
        Zp_6 memory t1 = s.mul(x.a, x.a);
        Zp_6 memory d = s.sub(t1, t0);
        return createElement(s.div(x.a, d), s.div(s.sub(s.zero(), x.b), d));
    }

    function equals(Zp_12 memory x, Zp_12 memory y) public view returns (bool) {
        return (s.equals(x.a, y.a) && s.equals(x.b, y.b));
    }

    function zero() public view returns (Zp_12 memory) {
        return Zp_12(s.zero(), s.zero());
    }

}
