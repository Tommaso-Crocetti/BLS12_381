// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./quadraticExtension.sol";

struct Zp_6 {
    Zp_2 a;
    Zp_2 b;
    Zp_2 c;
}

contract SexticExtension {
    QuadraticExtension q;

    constructor(QuadraticExtension quad) {
        q = quad;
    }

    function createElement(
        Zp_2 memory a,
        Zp_2 memory b,
        Zp_2 memory c
    ) public pure returns (Zp_6 memory) {
        return Zp_6(a, b, c);
    }

    function sum(
        Zp_6 memory x,
        Zp_6 memory y
    ) public view returns (Zp_6 memory) {
        return createElement(q.sum(x.a, y.a), q.sum(x.b, y.b), q.sum(x.c, y.c));
    }

    function sub(
        Zp_6 memory x,
        Zp_6 memory y
    ) public view returns (Zp_6 memory) {
        return createElement(q.sub(x.a, y.a), q.sub(x.b, y.b), q.sub(x.c, y.c));
    }

    function mul(
        Zp_6 memory x,
        Zp_6 memory y
    ) public view returns (Zp_6 memory) {
        Zp_2 memory t0 = q.mul(x.a, y.a);
        Zp_2 memory t1 = q.sum(q.mul(x.a, y.b), q.mul(x.b, y.a));
        Zp_2 memory t2 = q.sum(
            q.sum(q.mul(x.a, y.c), q.mul(x.b, y.b)),
            q.mul(x.c, y.a)
        );
        Zp_2 memory t3 = q.mul_nonres(q.sum(q.mul(x.b, y.c), q.mul(x.c, y.b)));
        Zp_2 memory t4 = q.mul_nonres(q.mul(x.c, y.c));
        return createElement(q.sum(t0, t3), q.sum(t1, t4), t2);
    }

    function inverse(Zp_6 memory x) public view returns (Zp_6 memory) {
        Zp_2 memory t0 = q.sub(q.mul(x.a, x.a), q.mul_nonres(q.mul(x.b, x.c)));
        Zp_2 memory t1 = q.sub(q.mul_nonres(q.mul(x.c, x.c)), q.mul(x.a, x.b));
        Zp_2 memory t2 = q.sub(q.mul(x.b, x.b), q.mul(x.a, x.c));
        Zp_2 memory t3 = q.sum(
            q.sum(q.mul(x.a, t0), q.mul_nonres(q.mul(x.c, t1))),
            q.mul_nonres(q.mul(x.b, t2))
        );
        return createElement(q.div(t0, t3), q.div(t1, t3), q.div(t2, t3));
    }

    function div(
        Zp_6 memory x,
        Zp_6 memory y
    ) public view returns (Zp_6 memory) {
        return mul(x, inverse(y));
    }

    function mul_nonres(Zp_6 memory x) public view returns (Zp_6 memory) {
        return createElement(q.mul_nonres(x.c), x.a, x.b);
    }

    function equals(Zp_6 memory x, Zp_6 memory y) public view returns (bool) {
        return (q.equals(x.a, y.a) && q.equals(x.b, y.b) && q.equals(x.c, y.c));
    }

    function zero() public view returns (Zp_6 memory) {
        return createElement(q.zero(), q.zero(), q.zero());
    }

    function one() public view returns (Zp_6 memory) {
        return createElement(q.one(), q.zero(), q.zero());
    }

    function two() public view returns (Zp_6 memory) {
        return createElement(q.two(), q.zero(), q.zero());
    }

    function three() public view returns (Zp_6 memory) {
        return createElement(q.three(), q.zero(), q.zero());
    }

    function four() public view returns (Zp_6 memory) {
        return createElement(q.four(), q.zero(), q.zero());
    }
}
