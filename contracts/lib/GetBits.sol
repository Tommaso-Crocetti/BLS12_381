// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./BigNumber.sol";

library GetBits {
    
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
        return bits;
    }

        function get_millerBits(
        BigNumber memory value
    ) public view returns (bool[] memory) {
        bool[] memory bits = new bool[](value.bitlen);
        bits = getBits(value);
        bool[] memory reversedBits = new bool[](bits.length - 1);
        // Copiamo gli elementi nell'ordine inverso, escludendo quello più significativo
        for (uint256 i = 0; i < bits.length - 1; i++) {
            reversedBits[i] = bits[bits.length - i - 2]; // -2 per escludere il primo elemento
        }
        return reversedBits;
    }
}