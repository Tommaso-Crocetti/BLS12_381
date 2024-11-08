// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../field/quadraticExtension.sol";

/// @title Enum PointType - Tipo di punto nel campo Zp
/// @dev Rappresenta il tipo di punto che può essere un punto affine o un punto all'infinito
enum PointType_2 {
    Affine, // Punto affine con coordinate (x, y)
    PointAtInfinity // Punto all'infinito (utilizzato per la curva ellittica)
}

/// @title Struct Point_Zp_2 - Struttura di un punto nel campo Zp_2
struct Point_Zp_2 {
    PointType_2 pointType; // Tipo del punto (Affine o all'infinito)
    Zp_2 x;
    Zp_2 y;
}

/// @title PointZp_2 - Contratto per operazioni sui punti in un campo quadratico esteso Zp_2
/// @dev Implementa operazioni comuni su punti in un campo quadratico esteso Zp_2, come addizione, doppio, negazione e moltiplicazione scalare.
contract PointZp_2 {
    QuadraticExtension private q; // Campo quadratico esteso Zp_2 su cui operare

    /// @notice Inizializza il contratto con un campo quadratico esteso
    /// @param field Il campo quadratico esteso su cui saranno effettuate le operazioni
    constructor(QuadraticExtension field) {
        q = field;
    }

    /// @notice Crea un nuovo punto affine o un punto all'infinito dato il tipo di punto, e le coordinate x e y
    /// @param x Coordinata x del punto affine nel campo quadratico esteso
    /// @param y Coordinata y del punto affine nel campo quadratico esteso
    /// @return Il nuovo punto nel campo Zp_2
    function newPoint(
        Zp_2 memory x,
        Zp_2 memory y
    ) public pure returns (Point_Zp_2 memory) {
        return Point_Zp_2(PointType_2.Affine, x, y);
    }

    /// @notice Restituisce il punto all'infinito nel campo Zp
    /// @return Un punto all'infinito nel campo Zp_2 (x = 0, y = 0)
    function point_at_infinity() public view returns (Point_Zp_2 memory) {
        return Point_Zp_2(PointType_2.PointAtInfinity, q.zero(), q.zero());
    }

    /// @notice Somma due punti nel campo quadratico esteso Zp_2
    /// @param self Primo punto (punto su una curva ellittica nel campo quadratico esteso)
    /// @param other Secondo punto (punto su una curva ellittica nel campo quadratico esteso)
    /// @return Il risultato della somma dei due punti
    function add(
        Point_Zp_2 memory self,
        Point_Zp_2 memory other
    ) public view returns (Point_Zp_2 memory) {
        if (self.pointType == PointType_2.PointAtInfinity) return other;
        if (other.pointType == PointType_2.PointAtInfinity) return self;
        if (q.equals(self.x, other.x) && q.equals(self.y, other.y))
            return double(self);
        if (q.equals(self.x, other.x) && !q.equals(self.y, other.y))
            return newPoint(q.zero(), q.zero());
        Zp_2 memory l = q.mul(
            q.sub(other.y, self.y),
            q.inverse(q.sub(other.x, self.x))
        );
        Zp_2 memory x_n = q.sub(q.sub(q.mul(l, l), self.x), other.x);
        Zp_2 memory y_n = q.sub(q.mul(q.sub(self.x, x_n), l), self.y);
        return newPoint(x_n, y_n);
    }

    /// @notice Raddoppia un punto nel campo quadratico esteso Zp_2
    /// @param self Il punto da raddoppiare
    /// @return Il risultato del raddoppio del punto
    function double(
        Point_Zp_2 memory self
    ) public view returns (Point_Zp_2 memory) {
        if (q.equals(self.y, q.zero()))
            return point_at_infinity();
        Zp_2 memory l = q.mul(
            q.mul(q.three(), q.mul(self.x, self.x)),
            q.inverse(q.mul(q.two(), self.y))
        );
        Zp_2 memory x_n = q.sub(q.sub(q.mul(l, l), self.x), self.x);
        Zp_2 memory y_n = q.sub(q.mul(q.sub(self.x, x_n), l), self.y);
        return newPoint(x_n, y_n);
    }

        function getBits(
        BigNumber memory value
    ) public view returns (bool[] memory) {
        uint256 index = 0;

        bool[] memory bits = new bool[](value.bitlen);
        while (BigNumbers.gt(value, BigNumbers.zero())) {
            // Inserisce 'true' se l'ultimo bit è 1, altrimenti 'false'
            bits[index] = (BigNumbers.isOdd(value));
            // Shifta a destra di un bit
            value = BigNumbers.shr(value, 1);
            index++;
        }

        bool[] memory reversedBits = new bool[](index);

        // Copiamo gli elementi nell'ordine inverso
        for (uint256 i = 0; i < index; i++) {
            reversedBits[i] = bits[index - i - 1]; 
        }

        return reversedBits;
    }

    /// @notice Moltiplica un punto per un numero intero k nel campo quadratico esteso Zp_2
    /// @param k Il numero intero da cui moltiplicare il punto
    /// @param self Il punto da moltiplicare
    /// @return Il risultato della moltiplicazione scalare del punto
    function multiply(
        BigNumber memory k,
        Point_Zp_2 memory self
    ) public view returns (Point_Zp_2 memory) {
        require(k.neg == false);
        Point_Zp_2 memory result = point_at_infinity();
        Point_Zp_2 memory current = self;
        bool[] memory bits = getBits(k);
        if (bits[0]) {
            result = current;
        }
        for (uint i = 1; i < bits.length; i++) {
            current = double(current);
            if (bits[i]) {
                result = add(result, current);
            }
        }
        return result;
    }

    /// @notice Confronta due punti nel campo quadratico esteso Zp_2 per verificarne l'uguaglianza
    /// @param a Primo punto da confrontare
    /// @param b Secondo punto da confrontare
    /// @return True se i punti sono uguali, altrimenti False
    function compare(
        Point_Zp_2 memory a,
        Point_Zp_2 memory b
    ) public view returns (bool) {
        if (
            a.pointType == PointType_2.PointAtInfinity &&
            b.pointType == PointType_2.PointAtInfinity
        ) {
            return true;
        }
        if (
            a.pointType == PointType_2.Affine && b.pointType == PointType_2.Affine
        ) {
            return q.equals(a.x, b.x) && q.equals(a.y, b.y);
        }
        return false;
    }
}