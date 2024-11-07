// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./pointZp.sol";
import "../field/quadraticExtension.sol";

/// @title Struct Point_Zp_2 - Struttura di un punto nel campo Zp_2
struct Point_Zp_2 {
    PointType pointType; // Tipo del punto (Affine o all'infinito)
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
    /// @param pointType Il tipo di punto (Affine o PointAtInfinity)
    /// @param x Coordinata x del punto affine nel campo quadratico esteso
    /// @param y Coordinata y del punto affine nel campo quadratico esteso
    /// @return Il nuovo punto nel campo Zp_2
    function newPoint(
        PointType pointType,
        Zp_2 memory x,
        Zp_2 memory y
    ) public pure returns (Point_Zp_2 memory) {
        return Point_Zp_2(pointType, x, y);
    }

    /// @notice Somma due punti nel campo quadratico esteso Zp_2
    /// @param self Primo punto (punto su una curva ellittica nel campo quadratico esteso)
    /// @param other Secondo punto (punto su una curva ellittica nel campo quadratico esteso)
    /// @return Il risultato della somma dei due punti
    function add(
        Point_Zp_2 memory self,
        Point_Zp_2 memory other
    ) public view returns (Point_Zp_2 memory) {
        if (self.pointType == PointType.PointAtInfinity) return other;
        if (other.pointType == PointType.PointAtInfinity) return self;
        if (q.equals(self.x, other.x) && q.equals(self.y, other.y))
            return double(self);
        if (q.equals(self.x, other.x) && !q.equals(self.y, other.y))
            return newPoint(PointType.PointAtInfinity, q.zero(), q.zero());
        Zp_2 memory l = q.mul(
            q.sub(other.y, self.y),
            q.inverse(q.sub(other.x, self.x))
        );
        Zp_2 memory x_n = q.sub(q.sub(q.mul(l, l), self.x), other.x);
        Zp_2 memory y_n = q.sub(q.mul(q.sub(self.x, x_n), l), self.y);
        return newPoint(PointType.Affine, x_n, y_n);
    }

    /// @notice Raddoppia un punto nel campo quadratico esteso Zp_2
    /// @param self Il punto da raddoppiare
    /// @return Il risultato del raddoppio del punto
    function double(
        Point_Zp_2 memory self
    ) public view returns (Point_Zp_2 memory) {
        if (q.equals(self.y, q.zero()))
            return newPoint(PointType.PointAtInfinity, q.zero(), q.zero());
        Zp_2 memory l = q.mul(
            q.mul(q.three(), q.mul(self.x, self.x)),
            q.inverse(q.mul(q.two(), self.y))
        );
        Zp_2 memory x_n = q.sub(q.sub(q.mul(l, l), self.x), self.x);
        Zp_2 memory y_n = q.sub(q.mul(q.sub(self.x, x_n), l), self.y);
        return newPoint(PointType.Affine, x_n, y_n);
    }

    /// @notice Calcola il punto negato di un punto nel campo quadratico esteso Zp_2
    /// @param self Il punto da negare
    /// @return Il punto negato (inverte la coordinata y)
    function negate(
        Point_Zp_2 memory self
    ) public view returns (Point_Zp_2 memory) {
        require(
            self.pointType != PointType.PointAtInfinity,
            "cannot negate point at infinity"
        );
        return newPoint(PointType.Affine, self.x, q.sub(q.zero(), self.y));
    }

    /// @notice Moltiplica un punto per un numero intero k nel campo quadratico esteso Zp_2
    /// @param k Il numero intero da cui moltiplicare il punto
    /// @param self Il punto da moltiplicare
    /// @return Il risultato della moltiplicazione scalare del punto
    function multiply(
        BigNumber memory k,
        Point_Zp_2 memory self
    ) public view returns (Point_Zp_2 memory) {
        Point_Zp_2 memory acc = newPoint(
            PointType.PointAtInfinity,
            q.zero(),
            q.zero()
        );
        if (!k.neg) return doubleAndAdd(k, self, acc);
        else
            return
                doubleAndAdd(
                    BigNumbers.mul(k, BigNumbers.init(1, true)),
                    negate(self),
                    acc
                );
    }

    /// @notice Algoritmo di raddoppio e somma (per moltiplicazione scalare)
    /// @param k Numero intero da moltiplicare
    /// @param self Il punto da moltiplicare
    /// @param acc L'accumulatore dei risultati intermedi
    /// @return Il punto risultante dalla moltiplicazione scalare
    function doubleAndAdd(
        BigNumber memory k,
        Point_Zp_2 memory self,
        Point_Zp_2 memory acc
    ) private view returns (Point_Zp_2 memory) {
        if (BigNumbers.cmp(k, BigNumbers.zero(), false) == 0) return acc;
        if (BigNumbers.isOdd(k))
            return
                doubleAndAdd(
                    BigNumbers.shr(k, 1),
                    double(self),
                    add(acc, self)
                );
        return doubleAndAdd(BigNumbers.shr(k, 1), double(self), acc);
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
            a.pointType == PointType.PointAtInfinity &&
            b.pointType == PointType.PointAtInfinity
        ) {
            return true;
        }
        if (
            a.pointType == PointType.Affine && b.pointType == PointType.Affine
        ) {
            return q.equals(a.x, b.x) && q.equals(a.y, b.y);
        }
        return false;
    }
}
