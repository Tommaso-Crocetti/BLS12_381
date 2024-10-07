// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Uint_381 Library
/// @notice Libreria per gestire interi a 381 bit rappresentati come coppia di uint256
library Uint381 {
    /// @dev Struct che rappresenta un intero a 381 bit
    struct Uint_381 {
        uint256 low; // Bit 0 - 255
        uint256 high; // Bit 256 - 380 (125 bit)
    }

    uint256 private constant MAX_HIGH = (1 << 125) - 1;

    /// @notice Crea un Uint_381 da un uint256
    /// @param value Il valore uint256 da convertire
    /// @return a L'Uint_381 risultante
    function fromUint(uint256 value) internal pure returns (Uint_381 memory a) {
        a.low = value;
        a.high = 0;
    }

    /// @notice Converte un Uint_381 in uint256, richiede che high sia 0
    /// @param a L'Uint_381 da convertire
    /// @return value Il valore uint256 risultante
    function toUint(Uint_381 memory a) internal pure returns (uint256 value) {
        require(a.high == 0, "Uint_381: overflow, high bits non zero");
        value = a.low;
    }

    function setUint_381(
        uint256 low,
        uint256 high
    ) public pure returns (Uint_381 memory) {
        require(high <= MAX_HIGH, "Uint_381: overflow, high bits non zero");
        return Uint_381(low, high);
    }

    /// @notice Aggiunge due Uint_381
    /// @param a Primo addendo
    /// @param b Secondo addendo
    /// @return c La somma di a e b
    function add(
        Uint_381 memory a,
        Uint_381 memory b
    ) internal pure returns (Uint_381 memory c) {
        // Sommiamo i campi low
        c.low = a.low + b.low;

        // Determina il carry basato sulla somma dei campi low
        uint256 carry = (c.low < a.low) ? 1 : 0;

        // Sommiamo i campi high e aggiungiamo il carry
        c.high = a.high + b.high + carry;

        // Verifica overflow nei 256 bit di c.high
        require(
            c.high >= a.high && c.high >= b.high && c.high <= MAX_HIGH,
            "Uint_381: overflow nei 256 bit di high"
        );
    }

    /// @notice Sottrae due Uint_381
    /// @param a Minuendo
    /// @param b Sottraendo
    /// @return c La differenza di a e b
    function sub(
        Uint_381 memory a,
        Uint_381 memory b
    ) internal pure returns (Uint_381 memory c) {
        uint256 carry = 0;
        // Sottraiamo i campi low
        if (a.low >= b.low) {
            c.low = a.low - b.low;
        } else {
            // Se a.low < b.low, dobbiamo prendere in prestito dalla parte high
            carry = 1; // Applichiamo il borrow
        }

        // Sottrazione tra high senza borrow aggiuntivo se già gestito
        if (a.low >= b.low) {
            c.high = a.high - b.high - carry;
        }

        // Controlliamo che non ci sia un underflow nella parte high
        require(c.high < (1 << 125), "Uint_381: underflow nella sottrazione");
    }

    /// @notice Confronta due Uint_381
    /// @param a Primo numero
    /// @param b Secondo numero
    /// @return result 1 se a > b, 0 se a == b, -1 se a < b
    function compare(
        Uint_381 memory a,
        Uint_381 memory b
    ) internal pure returns (int8 result) {
        if (a.high > b.high) {
            return 1;
        }
        if (a.high < b.high) {
            return -1;
        }
        if (a.low > b.low) {
            return 1;
        }
        if (a.low < b.low) {
            return -1;
        }
        return 0;
    }

    /// @notice Moltiplica un Uint_381 per un uint256
    /// @param a L'Uint_381 da moltiplicare
    /// @param b Il moltiplicatore uint256
    /// @return c Il prodotto di a e b
    function multiply(
        Uint_381 memory a,
        uint256 b
    ) internal pure returns (Uint_381 memory c) {
        uint256 lowProduct = a.low * b;
        uint256 highProduct = a.high * b;

        // Calcola il carry dalla moltiplicazione dei bit bassi
        uint256 carry = (a.low != 0 && lowProduct / a.low != b) ? 1 : 0;

        c.low = lowProduct;
        c.high = highProduct + carry;
        require(c.high <= MAX_HIGH, "Uint_381: overflow nella moltiplicazione");
    }

    /// @notice Esegue uno shift a sinistra di un numero di bit specificato
    /// @param a L'Uint_381 da shiftare
    /// @param bits Numero di bit da shiftare a sinistra
    /// @return c L'Uint_381 risultante dopo lo shift
    function shiftLeft(
        Uint_381 memory a,
        uint256 bits
    ) internal pure returns (Uint_381 memory c) {
        require(bits < 381, "Uint_381: shift troppo grande");

        if (bits == 0) {
            return a;
        } else if (bits < 256) {
            c.low = a.low << bits;
            c.high = (a.high << bits) | (a.low >> (256 - bits));
        } else {
            uint256 shiftedBits = bits - 256;
            require(shiftedBits < 125, "Uint_381: shift troppo grande");
            c.low = 0;
            c.high = a.low << shiftedBits;
        }

        require(
            c.high <= MAX_HIGH,
            "Uint_381: overflow nello shift a sinistra"
        );
    }

    /// @notice Esegue uno shift a destra di un numero di bit specificato
    /// @param a L'Uint_381 da shiftare
    /// @param bits Numero di bit da shiftare a destra
    /// @return c L'Uint_381 risultante dopo lo shift
    function shiftRight(
        Uint_381 memory a,
        uint256 bits
    ) internal pure returns (Uint_381 memory c) {
        require(bits < 381, "Uint_381: shift troppo grande");

        if (bits == 0) {
            return a;
        } else if (bits < 256) {
            c.low = (a.low >> bits) | (a.high << (256 - bits));
            c.high = a.high >> bits;
        } else {
            uint256 shiftedBits = bits - 256;
            require(shiftedBits < 125, "Uint_381: shift troppo grande");
            c.low = a.high >> shiftedBits;
            c.high = 0;
        }
    }

    /// @notice Verifica se due Uint_381 sono uguali
    /// @param a Primo Uint_381
    /// @param b Secondo Uint_381
    /// @return bool True se uguali, false altrimenti
    function equals(
        Uint_381 memory a,
        Uint_381 memory b
    ) internal pure returns (bool) {
        return (a.low == b.low) && (a.high == b.high);
    }

    /// @notice Calcola il modulo di un Uint_381 rispetto a un altro Uint_381
    /// @param a Numero di cui calcolare il modulo
    /// @param modulus Il modulo
    /// @return result Il risultato del modulo
    function modulo(
        Uint_381 memory a,
        Uint_381 memory modulus
    ) internal pure returns (Uint_381 memory result) {
        require(!isZero(modulus), "Uint_381: modulo per zero");

        Uint_381 memory dividend = a;
        Uint_381 memory m = modulus;

        while (compare(dividend, m) >= 0) {
            dividend = sub(dividend, m);
        }

        result = dividend;
    }

    /// @notice Verifica se un Uint_381 è zero
    /// @param a L'Uint_381 da verificare
    /// @return bool True se zero, false altrimenti
    function isZero(Uint_381 memory a) internal pure returns (bool) {
        return (a.low == 0) && (a.high == 0);
    }

    /// @notice Calcola il massimo tra due Uint_381
    /// @param a Primo Uint_381
    /// @param b Secondo Uint_381
    /// @return max Il massimo tra a e b
    function max(
        Uint_381 memory a,
        Uint_381 memory b
    ) internal pure returns (Uint_381 memory) {
        Uint_381 memory m = fromUint(0);
        if (compare(a, b) >= 0) {
            m = a;
        } else {
            m = b;
        }
        return m;
    }

    /// @notice Calcola il minimo tra due Uint_381
    /// @param a Primo Uint_381
    /// @param b Secondo Uint_381
    /// @return min Il minimo tra a e b
    function min(
        Uint_381 memory a,
        Uint_381 memory b
    ) internal pure returns (Uint_381 memory) {
        Uint_381 memory m = fromUint(0);
        if (compare(a, b) <= 0) {
            m = a;
        } else {
            m = b;
        }
        return m;
    }
}
