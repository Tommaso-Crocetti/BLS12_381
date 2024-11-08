// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../field/twelveExtension.sol";

enum PointType_12 {
    Affine, // Punto affine con coordinate (x, y)
    PointAtInfinity // Punto all'infinito (utilizzato per la curva ellittica)
}

/// @title Struct Point_Zp_12 - Struttura di un punto nel campo Zp_12
struct Point_Zp_12 {
    PointType_12 pointType; // Tipo del punto (Affine o PointAtInfinity)
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
    /// @param x Coordinata x del punto affine nel campo Zp_12
    /// @param y Coordinata y del punto affine nel campo Zp_12
    /// @return Il nuovo punto nel campo Zp_12
    function newPoint(
        Zp_12 memory x,
        Zp_12 memory y
    ) public pure returns (Point_Zp_12 memory) {
        return Point_Zp_12(PointType_12.PointAtInfinity, x, y);
    }

    /// @notice Restituisce il punto all'infinito nel campo Zp
    /// @return Un punto all'infinito nel campo Zp (x = 0, y = 0)
    function point_at_infinity() public view returns (Point_Zp_12 memory) {
        return Point_Zp_12(PointType_12.PointAtInfinity, t.zero(), t.zero());
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
            a.pointType == PointType_12.PointAtInfinity &&
            b.pointType == PointType_12.PointAtInfinity
        ) {
            return true;
        }
        if (
            a.pointType == PointType_12.Affine && b.pointType == PointType_12.Affine
        ) {
            return t.equals(a.x, b.x) && t.equals(a.y, b.y);
        }
        return false;
    }
}
