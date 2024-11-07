// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./pointZp.sol";
import "../field/twelveExtension.sol";

/// @title Struct Point_Zp_12 - Struttura di un punto nel campo Zp_12
    struct Point_Zp_12 {
    PointType pointType; // Tipo del punto (Affine o PointAtInfinity)
    Zp_12 x;
    Zp_12 y; 
}

/// @title PointZp_12 - Contratto per operazioni sui punti in un campo esteso Zp_12
/// @dev Implementa operazioni comuni su punti in un campo esteso Zp_12, come addizione, doppio, negazione e moltiplicazione scalare.
contract PointZp_12 {
    TwelveExtension private t; // Campo esteso Zp_12 su cui operare

    /// @notice Inizializza il contratto con un campo esteso Zp_12
    /// @param field Il campo esteso Zp_12 su cui saranno effettuate le operazioni
    constructor(TwelveExtension field) {
        t = field;
    }

    /// @notice Crea un nuovo punto affine o un punto all'infinito dato il tipo di punto, e le coordinate x e y
    /// @param pointType Il tipo di punto (Affine o PointAtInfinity)
    /// @param x Coordinata x del punto affine nel campo Zp_12
    /// @param y Coordinata y del punto affine nel campo Zp_12
    /// @return Il nuovo punto nel campo Zp_12
    function newPoint(
        PointType pointType,
        Zp_12 memory x,
        Zp_12 memory y
    ) public pure returns (Point_Zp_12 memory) {
        return Point_Zp_12(pointType, x, y);
    }

    /// @notice Somma due punti nel campo Zp_12
    /// @param self Primo punto (punto su una curva ellittica nel campo Zp_12)
    /// @param other Secondo punto (punto su una curva ellittica nel campo Zp_12)
    /// @return Il risultato della somma dei due punti
    function add(
        Point_Zp_12 memory self,
        Point_Zp_12 memory other
    ) public view returns (Point_Zp_12 memory) {
        if (self.pointType == PointType.PointAtInfinity) return other;
        if (other.pointType == PointType.PointAtInfinity) return self;
        if (t.equals(self.x, other.x) && t.equals(self.y, other.y))
            return double(self);
        if (t.equals(self.x, other.x) && !t.equals(self.y, other.y))
            return newPoint(PointType.PointAtInfinity, t.zero(), t.zero());
        Zp_12 memory l = t.mul(
            t.sub(other.y, self.y),
            t.inverse(t.sub(other.x, self.x))
        );
        Zp_12 memory x_n = t.sub(t.sub(t.mul(l, l), self.x), other.x);
        Zp_12 memory y_n = t.sub(t.mul(t.sub(self.x, x_n), l), self.y);
        return newPoint(PointType.Affine, x_n, y_n);
    }

    /// @notice Raddoppia un punto nel campo Zp_12
    /// @param self Il punto da raddoppiare
    /// @return Il risultato del raddoppio del punto
    function double(
        Point_Zp_12 memory self
    ) public view returns (Point_Zp_12 memory) {
        if (t.equals(self.y, t.zero()))
            return newPoint(PointType.PointAtInfinity, t.zero(), t.zero());
        Zp_12 memory l = t.mul(
            t.mul(t.three(), t.mul(self.x, self.x)),
            t.inverse(t.mul(t.two(), self.y))
        );
        Zp_12 memory x_n = t.sub(t.sub(t.mul(l, l), self.x), self.x);
        Zp_12 memory y_n = t.sub(t.mul(t.sub(self.x, x_n), l), self.y);
        return newPoint(PointType.Affine, x_n, y_n);
    }

    /// @notice Calcola il punto negato di un punto nel campo Zp_12
    /// @param self Il punto da negare
    /// @return Il punto negato (inverte la coordinata y)
    function negate(
        Point_Zp_12 memory self
    ) public view returns (Point_Zp_12 memory) {
        require(
            self.pointType != PointType.PointAtInfinity,
            "cannot negate point at infinity"
        );
        return newPoint(PointType.Affine, self.x, t.sub(t.zero(), self.y));
    }

    /// @notice Moltiplica un punto per un numero intero k nel campo Zp_12
    /// @param k Il numero intero da cui moltiplicare il punto
    /// @param self Il punto da moltiplicare
    /// @return Il risultato della moltiplicazione scalare del punto
    function multiply(
        BigNumber memory k,
        Point_Zp_12 memory self
    ) public view returns (Point_Zp_12 memory) {
        Point_Zp_12 memory acc = newPoint(
            PointType.PointAtInfinity,
            t.zero(),
            t.zero()
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
        Point_Zp_12 memory self,
        Point_Zp_12 memory acc
    ) private view returns (Point_Zp_12 memory) {
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

    /// @notice Confronta due punti nel campo Zp_12 per verificarne l'uguaglianza
    /// @param a Primo punto da confrontare
    /// @param b Secondo punto da confrontare
    /// @return True se i punti sono uguali, altrimenti False
    function compare(
        Point_Zp_12 memory a,
        Point_Zp_12 memory b
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
            return t.equals(a.x, b.x) && t.equals(a.y, b.y);
        }
        return false;
    }
}
