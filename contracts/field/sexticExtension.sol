// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./quadraticExtension.sol";

/// @title Zp_6 - Struttura per rappresentare un elemento nel campo sestico esteso
struct Zp_6 {
    Zp_2 a;
    Zp_2 b;
    Zp_2 c;
}

/// @title SexticExtension - Contratto per gestire l'estensione sestica di un campo quadratico esteso
/// @dev Questo contratto estende il campo quadratico `QuadraticExtension` per includere operazioni su numeri
///      nel campo finito sestico.
contract SexticExtension {
    QuadraticExtension q; // Estensione quadratica su cui si costruisce l'estensione sestica

    /// @notice Inizializza l'estensione sestica con un'estensione quadratica data
    /// @param quad L'estensione quadratica che funge da base per l'estensione sestica
    constructor(QuadraticExtension quad) {
        q = quad;
    }

    /// @notice Crea un elemento nel campo sestico dato tre componenti Zp_2
    /// @param a Prima componente del campo sestico
    /// @param b Seconda componente del campo sestico
    /// @param c Terza componente del campo sestico
    /// @return Un nuovo elemento Zp_6 che rappresenta l'elemento nel campo sestico
    function createElement(
        Zp_2 memory a,
        Zp_2 memory b,
        Zp_2 memory c
    ) public pure returns (Zp_6 memory) {
        return Zp_6(a, b, c);
    }

    /// @notice Converte un elemento Zp in un elemento Zp_6 con due componenti immaginarie nulle
    /// @param value L'elemento Zp da convertire
    /// @return Un nuovo elemento Zp_6 con la parte reale uguale a `value` e le due parti immaginarie nulle
    function fromZp(Zp memory value) public view returns (Zp_6 memory) {
        return Zp_6(q.fromZp(value), q.zero(), q.zero());
    }

    /// @notice Somma due elementi Zp_6 nel campo sestico
    /// @param x Primo elemento Zp_6
    /// @param y Secondo elemento Zp_6
    /// @return Un nuovo elemento Zp_6 risultato della somma
    function sum(
        Zp_6 memory x,
        Zp_6 memory y
    ) public view returns (Zp_6 memory) {
        return createElement(q.sum(x.a, y.a), q.sum(x.b, y.b), q.sum(x.c, y.c));
    }

    /// @notice Sottrae un elemento Zp_6 da un altro nel campo sestico
    /// @param x Primo elemento Zp_6 (minuendo)
    /// @param y Secondo elemento Zp_6 (sottraendo)
    /// @return Un nuovo elemento Zp_6 risultato della sottrazione
    function sub(
        Zp_6 memory x,
        Zp_6 memory y
    ) public view returns (Zp_6 memory) {
        return createElement(q.sub(x.a, y.a), q.sub(x.b, y.b), q.sub(x.c, y.c));
    }

    /// @notice Moltiplica due elementi Zp_6 nel campo sestico
    /// @param x Primo elemento Zp_6
    /// @param y Secondo elemento Zp_6
    /// @return Un nuovo elemento Zp_6 risultato della moltiplicazione
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

    /// @notice Calcola l'inverso di un elemento Zp_6 nel campo sestico
    /// @param x L'elemento Zp_6 di cui calcolare l'inverso
    /// @return Un nuovo elemento Zp_6 che rappresenta l'inverso di `x`
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

    /// @notice Divide due elementi Zp_6 nel campo sestico
    /// @param x Primo elemento Zp_6 (dividendo)
    /// @param y Secondo elemento Zp_6 (divisore)
    /// @return Un nuovo elemento Zp_6 risultato della divisione
    function div(
        Zp_6 memory x,
        Zp_6 memory y
    ) public view returns (Zp_6 memory) {
        return mul(x, inverse(y));
    }

    /// @notice Funzione per moltiplicare un elemento Zp_6 non-residuo quadratico
    /// @param x Elemento Zp_6 da moltiplicare
    /// @return Un nuovo elemento Zp_6 risultante dalla moltiplicazione
    function mul_nonres(Zp_6 memory x) public view returns (Zp_6 memory) {
        return createElement(q.mul_nonres(x.c), x.a, x.b);
    }

    /// @notice Confronta due elementi Zp_6 per verificarne l'uguaglianza
    /// @param x Primo elemento Zp_6
    /// @param y Secondo elemento Zp_6
    /// @return True se i due elementi sono uguali, altrimenti False
    function equals(Zp_6 memory x, Zp_6 memory y) public view returns (bool) {
        return (q.equals(x.a, y.a) && q.equals(x.b, y.b) && q.equals(x.c, y.c));
    }

    /// @notice Restituisce l'elemento zero nel campo sestico
    /// @return Un elemento Zp_6 che rappresenta lo zero (tutte le componenti sono nulle)
    function zero() public view returns (Zp_6 memory) {
        return createElement(q.zero(), q.zero(), q.zero());
    }

    /// @notice Restituisce l'elemento uno nel campo sestico
    /// @return Un elemento Zp_6 che rappresenta uno (prima componente uguale a uno e altre nulle)
    function one() public view returns (Zp_6 memory) {
        return createElement(q.one(), q.zero(), q.zero());
    }

    /// @notice Restituisce l'elemento due nel campo sestico
    /// @return Un elemento Zp_6 che rappresenta il due (prima componente uguale a due e altre nulle)
    function two() public view returns (Zp_6 memory) {
        return createElement(q.two(), q.zero(), q.zero());
    }

    /// @notice Restituisce l'elemento tre nel campo sestico
    /// @return Un elemento Zp_6 che rappresenta il tre (prima componente uguale a tre e altre nulle)
    function three() public view returns (Zp_6 memory) {
        return createElement(q.three(), q.zero(), q.zero());
    }

    /// @notice Restituisce l'elemento quattro nel campo sestico
    /// @return Un elemento Zp_6 che rappresenta il quattro (prima componente uguale a quattro e altre nulle)
    function four() public view returns (Zp_6 memory) {
        return createElement(q.four(), q.zero(), q.zero());
    }
}
