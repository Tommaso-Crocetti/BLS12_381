// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../BigNumber.sol";

/// @title Zp - Struttura per rappresentare un elemento di un campo finito modulo p
/// @dev Questa struttura contiene un singolo valore di tipo BigNumber
struct Zp {
    BigNumber value; // Valore dell'elemento (modulo p)
}

/// @title BigFiniteField - Contratto per la gestione di interi modulo p e operazioni di campo finito
/// @dev Consente di creare elementi modulo p e di eseguire operazioni aritmetiche sul campo finito definito
contract BigFiniteField {
    BigNumber private p; // Primo modulo p

    /// @notice Costruisce un nuovo campo finito con un modulo primo dato
    /// @param prime Il numero primo che definisce il modulo del campo
    /// @dev Il modulo deve essere un numero primo positivo e valido secondo il modificatore `verify`
    constructor(BigNumber memory prime) verify(prime) {
        p = prime;
    }

    /// @notice Verifica la correttezza di un numero BigNumber
    /// @dev Assicura che il numero sia positivo e che la rappresentazione in bit sia corretta
    /// @param bn Il BigNumber da verificare
    modifier verify(BigNumber memory bn) {
        require(bn.neg == false, "Il numero non puo' essere negativo.");
        uint msword;
        bytes memory val = bn.val;
        assembly {
            msword := mload(add(val, 0x20))
        } // ottiene la parola più significativa del risultato
        if (msword == 0) require(BigNumbers.isZero(bn), "BigNumber non nullo.");
        else
            require(
                (bn.val.length % 32 == 0) &&
                    (msword >> ((bn.bitlen - 1) % 256) == 1),
                "BigNumber non valido."
            );
        _;
    }

    /// @notice Restituisce il modulo p del campo finito
    /// @return Il modulo del campo finito come BigNumber
    function get_p() public view returns (BigNumber memory) {
        return p;
    }

    /// @notice Crea un elemento nel campo finito dato un valore BigNumber
    /// @param value Il valore BigNumber da convertire in un elemento del campo
    /// @return Un nuovo elemento del campo finito Zp
    function createElement(
        BigNumber memory value
    ) public view verify(value) returns (Zp memory) {
        return Zp(BigNumbers.mod(value, p));
    }

    /// @notice Somma due elementi del campo finito
    /// @param x Primo elemento Zp
    /// @param y Secondo elemento Zp
    /// @return Un nuovo elemento Zp risultato della somma
    function sum(
        Zp memory x,
        Zp memory y
    ) public view verify(x.value) verify(y.value) returns (Zp memory) {
        return createElement(BigNumbers.add(x.value, y.value));
    }

    /// @notice Sottrae un elemento Zp da un altro
    /// @param x Primo elemento Zp (minuendo)
    /// @param y Secondo elemento Zp (sottraendo)
    /// @return Un nuovo elemento Zp risultato della sottrazione
    function sub(
        Zp memory x,
        Zp memory y
    ) public view verify(x.value) verify(y.value) returns (Zp memory) {
        return createElement(BigNumbers.sub(x.value, y.value));
    }

    /// @notice Moltiplica due elementi del campo finito
    /// @param x Primo elemento Zp
    /// @param y Secondo elemento Zp
    /// @return Un nuovo elemento Zp risultato della moltiplicazione
    function mul(
        Zp memory x,
        Zp memory y
    ) public view verify(x.value) verify(y.value) returns (Zp memory) {
        return createElement(BigNumbers.modmul(x.value, y.value, p));
    }

    /// @notice Calcola l'inverso moltiplicativo di un elemento nel campo finito
    /// @dev Utilizza il teorema di Eulero per il calcolo dell'inverso
    /// @param x L'elemento Zp di cui calcolare l'inverso
    /// @return Un nuovo elemento Zp che rappresenta l'inverso di x
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

    /// @notice Divide due elementi del campo finito
    /// @param x Primo elemento Zp (dividendo)
    /// @param y Secondo elemento Zp (divisore)
    /// @return Un nuovo elemento Zp risultato della divisione
    function div(
        Zp memory x,
        Zp memory y
    ) public view verify(x.value) verify(y.value) returns (Zp memory) {
        return mul(x, inverse(y));
    }

    /// @notice Funzione placeholder per la moltiplicazione di un non-residuo quadratico
    /// @param x Elemento Zp da moltiplicare
    /// @return Lo stesso elemento x (placeholder)
    function mul_nonres(
        Zp memory x
    ) public pure verify(x.value) returns (Zp memory) {
        return x;
    }

    /// @notice Confronta due elementi per verificarne l'uguaglianza
    /// @param x Primo elemento Zp
    /// @param y Secondo elemento Zp
    /// @return True se i due elementi sono uguali, altrimenti False
    function equals(
        Zp memory x,
        Zp memory y
    ) public pure verify(x.value) verify(y.value) returns (bool) {
        return BigNumbers.eq(x.value, y.value);
    }

    /// @notice Restituisce l'elemento zero del campo finito
    /// @return Un elemento Zp che rappresenta lo zero
    function zero() public pure returns (Zp memory) {
        return Zp(BigNumbers.zero());
    }

    /// @notice Restituisce l'elemento uno del campo finito
    /// @return Un elemento Zp che rappresenta l'uno
    function one() public pure returns (Zp memory) {
        return Zp(BigNumbers.one());
    }

    /// @notice Restituisce l'elemento due del campo finito
    /// @return Un elemento Zp che rappresenta il valore due
    function two() public pure returns (Zp memory) {
        return Zp(BigNumbers.two());
    }

    /// @notice Restituisce l'elemento tre del campo finito
    /// @return Un elemento Zp che rappresenta il valore tre
    function three() public view returns (Zp memory) {
        return Zp(BigNumbers.three());
    }

    /// @notice Restituisce l'elemento quattro del campo finito
    /// @return Un elemento Zp che rappresenta il valore quattro
    function four() public view returns (Zp memory) {
        return Zp(BigNumbers.four());
    }
}
