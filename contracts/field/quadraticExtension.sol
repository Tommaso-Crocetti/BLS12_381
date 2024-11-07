// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./bigFiniteField.sol";

/// @title Zp_2 - Struttura per rappresentare un elemento nel campo quadratico esteso
/// @dev Questa struttura contiene due elementi Zp, uno per la parte reale e uno per la parte immaginaria
struct Zp_2 {
    Zp a;
    Zp b; 
}

/// @title QuadraticExtension - Contratto per gestire l'estensione quadratica di un campo finito
/// @dev Questo contratto estende il campo finito `BigFiniteField` per includere operazioni su numeri complessi (quadratici)
contract QuadraticExtension {
    BigFiniteField f; // Campo finito di base

    /// @notice Inizializza l'estensione quadratica con un campo finito dato
    /// @param field Il campo finito di base su cui si costruisce l'estensione quadratica
    constructor(BigFiniteField field) {
        f = field;
    }

    /// @notice Crea un elemento nell'estensione quadratica dato due valori Zp
    /// @param a Parte reale dell'elemento
    /// @param b Parte immaginaria dell'elemento
    /// @return Un nuovo elemento Zp_2 che rappresenta l'elemento nel campo quadratico esteso
    function createElement(
        Zp memory a,
        Zp memory b
    ) public pure returns (Zp_2 memory) {
        return Zp_2(a, b);
    }

    /// @notice Converte un elemento Zp in un elemento Zp_2 con parte immaginaria nulla
    /// @param value L'elemento Zp da convertire
    /// @return Un nuovo elemento Zp_2 con parte reale uguale a `value` e parte immaginaria nulla
    function fromZp(Zp memory value) public view returns (Zp_2 memory) {
        return Zp_2(value, f.zero());
    }

    /// @notice Somma due elementi Zp_2 nel campo quadratico esteso
    /// @param x Primo elemento Zp_2
    /// @param y Secondo elemento Zp_2
    /// @return Un nuovo elemento Zp_2 risultato della somma
    function sum(
        Zp_2 memory x,
        Zp_2 memory y
    ) public view returns (Zp_2 memory) {
        return createElement(f.sum(x.a, y.a), f.sum(x.b, y.b));
    }

    /// @notice Sottrae un elemento Zp_2 da un altro nel campo quadratico esteso
    /// @param x Primo elemento Zp_2 (minuendo)
    /// @param y Secondo elemento Zp_2 (sottraendo)
    /// @return Un nuovo elemento Zp_2 risultato della sottrazione
    function sub(
        Zp_2 memory x,
        Zp_2 memory y
    ) public view returns (Zp_2 memory) {
        return createElement(f.sub(x.a, y.a), f.sub(x.b, y.b));
    }

    /// @notice Moltiplica due elementi Zp_2 nel campo quadratico esteso
    /// @param x Primo elemento Zp_2
    /// @param y Secondo elemento Zp_2
    /// @return Un nuovo elemento Zp_2 risultato della moltiplicazione
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

    /// @notice Calcola l'inverso di un elemento Zp_2 nel campo quadratico esteso
    /// @param x L'elemento Zp_2 di cui calcolare l'inverso
    /// @return Un nuovo elemento Zp_2 che rappresenta l'inverso di x
    function inverse(Zp_2 memory x) public view returns (Zp_2 memory) {
        Zp memory d = f.inverse(f.sum(f.mul(x.a, x.a), f.mul(x.b, x.b)));
        return createElement(f.mul(x.a, d), f.mul(f.sub(f.zero(), x.b), d));
    }

    /// @notice Divide due elementi Zp_2 nel campo quadratico esteso
    /// @param x Primo elemento Zp_2 (dividendo)
    /// @param y Secondo elemento Zp_2 (divisore)
    /// @return Un nuovo elemento Zp_2 risultato della divisione
    function div(
        Zp_2 memory x,
        Zp_2 memory y
    ) public view returns (Zp_2 memory) {
        return mul(x, inverse(y));
    }

    /// @notice Funzione per moltiplicare un elemento Zp_2 non-residuo quadratico
    /// @param x Elemento Zp_2 da moltiplicare
    /// @return Un nuovo elemento Zp_2 risultante dalla moltiplicazione
    function mul_nonres(Zp_2 memory x) public view returns (Zp_2 memory) {
        return createElement(f.sub(x.a, x.b), f.sum(x.a, x.b));
    }

    /// @notice Confronta due elementi Zp_2 per verificarne l'uguaglianza
    /// @param x Primo elemento Zp_2
    /// @param y Secondo elemento Zp_2
    /// @return True se i due elementi sono uguali, altrimenti False
    function equals(Zp_2 memory x, Zp_2 memory y) public view returns (bool) {
        return (f.equals(x.a, y.a) && f.equals(x.b, y.b));
    }

    /// @notice Restituisce l'elemento zero nel campo quadratico esteso
    /// @return Un elemento Zp_2 che rappresenta lo zero (parte reale e immaginaria nulla)
    function zero() public view returns (Zp_2 memory) {
        return createElement(f.zero(), f.zero());
    }

    /// @notice Restituisce l'elemento uno nel campo quadratico esteso
    /// @return Un elemento Zp_2 che rappresenta uno (parte reale uguale a uno e parte immaginaria nulla)
    function one() public view returns (Zp_2 memory) {
        return createElement(f.one(), f.zero());
    }

    /// @notice Restituisce l'elemento due nel campo quadratico esteso
    /// @return Un elemento Zp_2 che rappresenta il due (parte reale uguale a due e parte immaginaria nulla)
    function two() public view returns (Zp_2 memory) {
        return createElement(f.two(), f.zero());
    }

    /// @notice Restituisce l'elemento tre nel campo quadratico esteso
    /// @return Un elemento Zp_2 che rappresenta il tre (parte reale uguale a tre e parte immaginaria nulla)
    function three() public view returns (Zp_2 memory) {
        return createElement(f.three(), f.zero());
    }

    /// @notice Restituisce l'elemento quattro nel campo quadratico esteso
    /// @return Un elemento Zp_2 che rappresenta il quattro (parte reale uguale a quattro e parte immaginaria nulla)
    function four() public view returns (Zp_2 memory) {
        return createElement(f.four(), f.zero());
    }
}
