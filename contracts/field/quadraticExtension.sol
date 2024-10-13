// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./bigFiniteField.sol";

struct Zp_2 {
    Zp a; // Parte reale
    Zp b; // Parte immaginaria
}

/// @title Quadratic Extension Field Zp[i] where i^2 = -1
/// @notice Rappresenta Zp_2i in Zp[x]/(x^2 + 1)
contract QuadraticExtension {
    BigFiniteField f;

    constructor(BigFiniteField field) {
        f = field;
    }

    function createElement(
        Zp memory a,
        Zp memory b
    ) public pure returns (Zp_2 memory) {
        return Zp_2(a, b);
    }

    /// @notice Aggiunge due Zp_2i in Zp[i]
    function sum(
        Zp_2 memory x,
        Zp_2 memory y
    ) public view returns (Zp_2 memory) {
        return createElement(f.sum(x.a, y.a), f.sum(x.b, y.b));
    }

    /// @notice Sottrae due Zp_2i in Zp[i]
    function sub(
        Zp_2 memory x,
        Zp_2 memory y
    ) public view returns (Zp_2 memory) {
        return createElement(f.sub(x.a, y.a), f.sub(x.b, y.b));
    }

    /// @notice Moltiplica due Zp_2i in Zp[i]
    /// (a + b*i)(c + d*i) = (a*c - b*d) + (a*d + b*c)*i
    function mul(
        Zp_2 memory x,
        Zp_2 memory y
    ) public view returns (Zp_2 memory) {
        return
            createElement(
                f.sub(f.mul(x.a, y.a), f.mul(x.b, y.b)),
                f.sum(f.mul(x.a, y.b), f.mul(x.b, y.a))
            );
    }

    /// @notice Calcola l'inverso moltiplicativo di un Zp_2o in Zp[i]
    /// (a + b*i)^-1 = (a - b*i) / (a^2 + b^2)
    function inverse(Zp_2 memory x) public view returns (Zp_2 memory) {
        Zp memory d = f.inverse(f.sum(f.mul(x.a, x.a), f.mul(x.b, x.b)));
        return createElement(f.mul(x.a, d), f.mul(f.sub(f.zero(), x.b), d));
    }

    function div(
        Zp_2 memory x,
        Zp_2 memory y
    ) public view returns (Zp_2 memory) {
        return mul(x, inverse(y));
    }

    function mul_nonres(Zp_2 memory x) public view returns (Zp_2 memory) {
        return createElement(f.sum(x.a, x.b), f.sub(x.a, x.b));
    }

    /// @notice Verifica l'uguaglianza di due Zp_2i
    function equals(Zp_2 memory x, Zp_2 memory y) public view returns (bool) {
        return (f.equals(x.a, y.a) && f.equals(x.b, y.b));
    }

    function zero() public view returns (Zp_2 memory) {
        return Zp_2(f.zero(), f.zero());
    }

}
