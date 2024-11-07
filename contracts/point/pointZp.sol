// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../field/bigFiniteField.sol";

/// @title Enum PointType - Tipo di punto nel campo Zp
/// @dev Rappresenta il tipo di punto che può essere un punto affine o un punto all'infinito
enum PointType {
    Affine, // Punto affine con coordinate (x, y)
    PointAtInfinity // Punto all'infinito (utilizzato per la curva ellittica)
}

/// @title Struct Point_Zp - Struttura di un punto nel campo Zp
/// @dev Rappresenta un punto nel campo Zp, con tipo di punto (Affine o all'infinito)
struct Point_Zp {
    PointType pointType; // Tipo del punto (Affine o all'infinito)
    Zp x;
    Zp y;
}

/// @title PointZp - Contratto per operazioni sui punti nel campo Zp
/// @dev Implementa operazioni comuni su punti in un campo Zp, come addizione, doppio, negazione e moltiplicazione scalare.
contract PointZp {
    BigFiniteField private f; // Campo finito su cui operare (es. Zp)

    /// @notice Inizializza il contratto con un campo finito
    /// @param field Il campo finito su cui saranno effettuate le operazioni
    constructor(BigFiniteField field) {
        f = field;
    }

    /// @notice Crea un nuovo punto affine dato x e y
    /// @param x Coordinata x del punto affine
    /// @param y Coordinata y del punto affine
    /// @return Un nuovo punto affine nel campo Zp
    function newPoint(
        Zp memory x,
        Zp memory y
    ) public pure returns (Point_Zp memory) {
        return Point_Zp(PointType.Affine, x, y);
    }

    /// @notice Restituisce il punto all'infinito nel campo Zp
    /// @return Un punto all'infinito nel campo Zp (x = 0, y = 0)
    function point_at_infinity() public view returns (Point_Zp memory) {
        return Point_Zp(PointType.PointAtInfinity, f.zero(), f.zero());
    }

    /// @notice Somma due punti nel campo Zp
    /// @param self Primo punto (punto su una curva ellittica)
    /// @param other Secondo punto (punto su una curva ellittica)
    /// @return Il risultato della somma dei due punti
    function add(
        Point_Zp memory self,
        Point_Zp memory other
    ) public view returns (Point_Zp memory) {
        if (self.pointType == PointType.PointAtInfinity) return other;
        if (other.pointType == PointType.PointAtInfinity) return self;
        if (f.equals(self.x, other.x) && f.equals(self.y, other.y))
            return double(self);
        if (f.equals(self.x, other.x) && !f.equals(self.y, other.y))
            return point_at_infinity();
        Zp memory l = f.mul(
            f.sub(other.y, self.y),
            f.inverse(f.sub(other.x, self.x))
        );
        Zp memory x_n = f.sub(f.sub(f.mul(l, l), self.x), other.x);
        Zp memory y_n = f.sub(f.mul(f.sub(self.x, x_n), l), self.y);
        return newPoint(x_n, y_n);
    }

    /// @notice Raddoppia un punto nel campo Zp
    /// @param self Il punto da raddoppiare
    /// @return Il risultato del raddoppio del punto
    function double(
        Point_Zp memory self
    ) public view returns (Point_Zp memory) {
        if (f.equals(self.y, f.zero())) return point_at_infinity();
        Zp memory l = f.mul(
            f.mul(f.three(), f.mul(self.x, self.x)),
            f.inverse(f.mul(f.two(), self.y))
        );
        Zp memory x_n = f.sub(f.sub(f.mul(l, l), self.x), self.x);
        Zp memory y_n = f.sub(f.mul(f.sub(self.x, x_n), l), self.y);
        return newPoint(x_n, y_n);
    }

    /// @notice Calcola il punto negato di un punto nel campo Zp
    /// @param self Il punto da negare
    /// @return Il punto negato (inverte la coordinata y)
    function negate(
        Point_Zp memory self
    ) public view returns (Point_Zp memory) {
        require(
            self.pointType != PointType.PointAtInfinity,
            "cannot negate point at infinity"
        );
        return newPoint(self.x, f.sub(f.zero(), self.y));
    }

    /// @notice Moltiplica un punto per un numero intero k nel campo Zp
    /// @param k Il numero intero da cui moltiplicare il punto
    /// @param self Il punto da moltiplicare
    /// @return Il risultato della moltiplicazione scalare del punto
    function multiply(
        BigNumber memory k,
        Point_Zp memory self
    ) public view returns (Point_Zp memory) {
        Point_Zp memory acc = point_at_infinity();
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
        Point_Zp memory self,
        Point_Zp memory acc
    ) private view returns (Point_Zp memory) {
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

    /// @notice Confronta due punti nel campo Zp per verificarne l'uguaglianza
    /// @param a Primo punto da confrontare
    /// @param b Secondo punto da confrontare
    /// @return True se i punti sono uguali, altrimenti False
    function compare(
        Point_Zp memory a,
        Point_Zp memory b
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
            return f.equals(a.x, b.x) && f.equals(a.y, b.y);
        }
        return false;
    }
}
