// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "../BigNumber.sol";

struct Zp {
    BigNumber value; // Valore dell'elemento (modulo p)
}

contract BigFiniteField {
    BigNumber private p; // Primo modulo p

    // Costruttore che inizializza il campo finito con un primo modulo p
    constructor(BigNumber memory prime) verify(prime) {
        p = prime;
    }

    modifier verify(BigNumber memory bn) {
        //require(bn.neg == false);
        uint msword;
        bytes memory val = bn.val;
        assembly {
            msword := mload(add(val, 0x20))
        } //get msword of result
        if (msword == 0) require(BigNumbers.isZero(bn));
        else
            require(
                (bn.val.length % 32 == 0) &&
                    (msword >> ((bn.bitlen - 1) % 256) == 1)
            );
        _;
    }
    
    function get_p() public view returns (BigNumber memory) {
        return p;
    }

    // Funzione per creare un elemento nel campo finito
    function createElement(
        BigNumber memory value
    ) public view verify(value) returns (Zp memory) {
        return Zp(BigNumbers.mod(value, p));
    }

    // Operazione di somma nel campo finito
    function sum(
        Zp memory x,
        Zp memory y
    ) public view verify(x.value) verify(y.value) returns (Zp memory) {
        return createElement(BigNumbers.add(x.value, y.value));
    }

    // Operazione di sottrazione nel campo finito
    function sub(
        Zp memory x,
        Zp memory y
    ) public view verify(x.value) verify(y.value) returns (Zp memory) {
        return
            createElement(BigNumbers.sub(x.value, y.value));
    }

    // Operazione di moltiplicazione nel campo finito
    function mul(
        Zp memory x,
        Zp memory y
    ) public view verify(x.value) verify(y.value) returns (Zp memory) {
        return createElement(BigNumbers.modmul(x.value, y.value, p));
    }

    function inverse(
        Zp memory x
    ) public view verify(x.value) returns (Zp memory) {
        require(
            BigNumbers.cmp(x.value, BigNumbers.zero(), false) != 0,
            "Inverso di zero non definito."
        );
        return
            createElement(
                BigNumbers.modexp(
                    x.value,
                    BigNumbers.sub(p, BigNumbers.two()),
                    p
                )
            );
    }

    // Operazione di divisione nel campo finito (usando l'inverso moltiplicativo)
    function div(
        Zp memory x,
        Zp memory y
    ) public view verify(x.value) verify(y.value) returns (Zp memory) {
        return mul(x, inverse(y));
    }

    function mul_nonres(
        Zp memory x
    ) public pure verify(x.value) returns (Zp memory) {
        return x;
    }

    function equals(
        Zp memory x,
        Zp memory y
    ) public pure verify(x.value) verify(y.value) returns (bool) {
        return BigNumbers.cmp(x.value, y.value, false) == 0;
    }

    function zero() public pure returns (Zp memory) {
        return Zp(BigNumbers.zero());
    }

    function one() public pure returns (Zp memory) {
        return Zp(BigNumbers.one());
    }

    function two() public pure returns (Zp memory) {
        return Zp(BigNumbers.two());
    }

    function three() public view returns (Zp memory) {
        return Zp(BigNumbers.three());
    }

    function four() public view returns (Zp memory) {
        return Zp(BigNumbers.four());
    }
}
