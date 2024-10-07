// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../BigNumber.sol";

struct Zp {
    uint256 value; // Valore dell'elemento (modulo p)
}

contract FiniteField {
    // Primo modulo p
    uint256 public p;

    // Struttura per rappresentare un elemento del campo finito

    // Costruttore che inizializza il campo finito con un primo modulo p
    constructor(uint256 prime) {
        p = prime;
    }

    // Funzione per creare un elemento nel campo finito
    function createElement(uint256 value) public view returns (Zp memory) {
        return Zp(value % p);
    }

    // Operazione di somma nel campo finito
    function sum(Zp memory a, Zp memory b) public view returns (Zp memory) {
        return createElement(addmod(a.value, b.value, p));
    }

    // Operazione di sottrazione nel campo finito
    function sub(Zp memory a, Zp memory b) public view returns (Zp memory) {
        uint256 diff = a.value >= b.value
            ? a.value - b.value
            : p + a.value - b.value;
        return createElement(diff);
    }

    // Operazione di moltiplicazione nel campo finito
    function mul(Zp memory a, Zp memory b) public view returns (Zp memory) {
        return createElement(mulmod(a.value, b.value, p));
    }

    function inverse(Zp memory a) public view returns (Zp memory) {
        require(a.value != 0, "Divisione per zero non permessa.");
        uint256 inv = exp(a.value, p - 2);
        return createElement(inv);
    }

    function exp(uint256 base, uint256 exponent) public view returns (uint256) {
        uint256 result = 1;
        uint256 b = base % p;
        uint256 e = exponent;
        while (e > 0) {
            if (e & 1 == 1) {
                // Se l'esponente è dispari
                result = mulmod(result, b, p);
            }
            b = mulmod(b, b, p);
            e >>= 1; // Dividi l'esponente per 2
        }
        return result;
    }

    // Operazione di divisione nel campo finito (usando l'inverso moltiplicativo)
    function div(Zp memory a, Zp memory b) public view returns (Zp memory) {
        return mul(a, inverse(b));
    }

    function mul_nonres(Zp memory a) public pure returns (Zp memory) {
        return a;
    }

    function equals(Zp memory a, Zp memory b) public pure returns (bool) {
        return (a.value) == (b.value);
    }

    function zero() public pure returns (Zp memory) {
        return Zp(0);
    }
}
