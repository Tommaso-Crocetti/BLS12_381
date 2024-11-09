// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/GetBits.sol";
import "./sexticExtension.sol";

/// @title Zp_12 - Struttura per rappresentare un elemento nel campo dodicesimo esteso
/// @dev Questa struttura contiene due componenti Zp_6, che rappresentano le due dimensioni
///      di un elemento nel campo finito dodicesimo.
struct Zp_12 {
    Zp_6 a; // Prima componente del campo dodicesimo
    Zp_6 b; // Seconda componente del campo dodicesimo
}

/// @title TwelveExtension - Contratto per gestire l'estensione dodicesima di un campo sestico esteso
/// @dev Questo contratto estende il campo sestico `SexticExtension` per includere operazioni su numeri
///      nel campo finito dodicesimo.
contract TwelveExtension {
    SexticExtension s; // Estensione sestica su cui si costruisce l'estensione dodicesima

    /// @notice Inizializza l'estensione dodicesima con un'estensione sestica data
    /// @param six L'estensione sestica che funge da base per l'estensione dodicesima
    constructor(SexticExtension six) {
        s = six;
    }

    /// @notice Crea un elemento nel campo dodicesimo dato due componenti Zp_6
    /// @param x Prima componente del campo dodicesimo
    /// @param y Seconda componente del campo dodicesimo
    /// @return Un nuovo elemento Zp_12 che rappresenta l'elemento nel campo dodicesimo
    function createElement(
        Zp_6 memory x,
        Zp_6 memory y
    ) public pure returns (Zp_12 memory) {
        return Zp_12(x, y);
    }

    /// @notice Converte un elemento Zp in un elemento Zp_12 con la seconda componente nulla
    /// @param value L'elemento Zp da convertire
    /// @return Un nuovo elemento Zp_12 con la prima componente uguale a `value` e la seconda componente nulla
    function fromZp(Zp memory value) public view returns (Zp_12 memory) {
        return Zp_12(s.fromZp(value), s.zero());
    }

    /// @notice Somma due elementi Zp_12 nel campo dodicesimo
    /// @param x Primo elemento Zp_12
    /// @param y Secondo elemento Zp_12
    /// @return Un nuovo elemento Zp_12 risultato della somma
    function sum(
        Zp_12 memory x,
        Zp_12 memory y
    ) public view returns (Zp_12 memory) {
        return createElement(s.sum(x.a, y.a), s.sum(x.b, y.b));
    }

    /// @notice Sottrae un elemento Zp_12 da un altro nel campo dodicesimo
    /// @param x Primo elemento Zp_12 (minuendo)
    /// @param y Secondo elemento Zp_12 (sottraendo)
    /// @return Un nuovo elemento Zp_12 risultato della sottrazione
    function sub(
        Zp_12 memory x,
        Zp_12 memory y
    ) public view returns (Zp_12 memory) {
        return createElement(s.sub(x.a, y.a), s.sub(x.b, y.b));
    }

    /// @notice Moltiplica due elementi Zp_12 nel campo dodicesimo
    /// @param x Primo elemento Zp_12
    /// @param y Secondo elemento Zp_12
    /// @return Un nuovo elemento Zp_12 risultato della moltiplicazione
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

    /// @notice Calcola l'inverso di un elemento Zp_12 nel campo dodicesimo
    /// @param x L'elemento Zp_12 di cui calcolare l'inverso
    /// @return Un nuovo elemento Zp_12 che rappresenta l'inverso di `x`
    function inverse(Zp_12 memory x) public view returns (Zp_12 memory) {
        require(!equals(x, zero()), "Cannot invert zero element");
        Zp_6 memory t0 = s.mul_nonres(s.mul(x.b, x.b));
        Zp_6 memory t1 = s.mul(x.a, x.a);
        Zp_6 memory d = s.sub(t1, t0);
        return createElement(s.div(x.a, d), s.div(s.sub(s.zero(), x.b), d));
    }

    /// @notice Divide due elementi Zp_12 nel campo dodicesimo
    /// @param x Primo elemento Zp_12 (dividendo)
    /// @param y Secondo elemento Zp_12 (divisore)
    /// @return Un nuovo elemento Zp_12 risultato della divisione
    function div(
        Zp_12 memory x,
        Zp_12 memory y
    ) public view returns (Zp_12 memory) {
        return mul(x, inverse(y));
    }

    function exp(Zp_12 memory value, BigNumber memory e) public view returns (Zp_12 memory) {
        if (BigNumbers.isZero(e)) {
            return one();
        }
        Zp_12 memory result = one();
        Zp_12 memory current = value;
        bool[] memory bits = GetBits.getBits(e);
        if (bits[0]) {
            result = mul(result, current);
        }
        for (uint i = 1; i < bits.length; i++) {
            current = mul(current, current);
            if (bits[i]) {
                result = mul(result, current);
            }
        }
        return result;
    }


    /// @notice Confronta due elementi Zp_12 per verificarne l'uguaglianza
    /// @param x Primo elemento Zp_12
    /// @param y Secondo elemento Zp_12
    /// @return True se i due elementi sono uguali, altrimenti False
    function equals(Zp_12 memory x, Zp_12 memory y) public view returns (bool) {
        return (s.equals(x.a, y.a) && s.equals(x.b, y.b));
    }

    /// @notice Restituisce l'elemento zero nel campo dodicesimo
    /// @return Un elemento Zp_12 che rappresenta lo zero (tutte le componenti sono nulle)
    function zero() public view returns (Zp_12 memory) {
        return createElement(s.zero(), s.zero());
    }

    /// @notice Restituisce l'elemento uno nel campo dodicesimo
    /// @return Un elemento Zp_12 che rappresenta uno (prima componente uguale a uno e la seconda nulla)
    function one() public view returns (Zp_12 memory) {
        return createElement(s.one(), s.zero());
    }

    /// @notice Restituisce l'elemento due nel campo dodicesimo
    /// @return Un elemento Zp_12 che rappresenta il due (prima componente uguale a due e la seconda nulla)
    function two() public view returns (Zp_12 memory) {
        return createElement(s.two(), s.zero());
    }

    /// @notice Restituisce l'elemento tre nel campo dodicesimo
    /// @return Un elemento Zp_12 che rappresenta il tre (prima componente uguale a tre e la seconda nulla)
    function three() public view returns (Zp_12 memory) {
        return createElement(s.three(), s.zero());
    }

    /// @notice Restituisce l'elemento quattro nel campo dodicesimo
    /// @return Un elemento Zp_12 che rappresenta il quattro (prima componente uguale a quattro e la seconda nulla)
    function four() public view returns (Zp_12 memory) {
        return createElement(s.four(), s.zero());
    }
}
