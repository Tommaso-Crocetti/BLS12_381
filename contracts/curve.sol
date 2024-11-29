// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./lib/BigNumber.sol";
import "./field/bigFiniteField.sol";
import "./field/sexticExtension.sol";
import "./point/pointZp.sol";
import "./point/pointZp_2.sol";
import "./point/pointZp_12.sol";

/**
 * @title Curve
 * @dev Implementa il protocollo di firma BLS su BLS12-381.
 * 
 * Funzionalità principali:
 * - Controllo dell'appartenenza dei punti alla curva in vari campi.
 * - Verifica dell'appartenenza a sottogruppi specifici.
 * - Operazioni di twist per trasformare punti in campi estesi.
 * - Calcolo di pairing tra punti per la verifica di firme crittografiche.
 */
contract Curve {
    BigNumber private X = BigNumbers.init__(hex"d201000000010000", false);
    BigNumber private prime =
        BigNumbers.init__(
            hex"1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab",
            false
        );

    BigNumber private order =
        BigNumbers.init__(
            hex"73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001", false
        );
    BigFiniteField private fField = new BigFiniteField(prime);
    QuadraticExtension private qField = new QuadraticExtension(fField);
    SexticExtension private sField = new SexticExtension(qField);
    TwelveExtension private tField = new TwelveExtension(sField);
    PointZp private pZp = new PointZp(fField);
    PointZp_2 private pZp_2 = new PointZp_2(qField);
    PointZp_12 private pZp_12 = new PointZp_12(tField);
    Point_Zp private g0 =
        pZp.newPoint(
            fField.createElement(
                BigNumbers.init__(
                    hex"17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb",
                    false
                )
            ),
            fField.createElement(
                BigNumbers.init__(
                    hex"08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1",
                    false
                )
            )
        );
    Point_Zp_2 private g1 =
        pZp_2.newPoint(
            qField.createElement(
                fField.createElement(
                    BigNumbers.init__(
                        hex"024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8",
                        false
                    )
                ),
                fField.createElement(
                    BigNumbers.init__(
                        hex"13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e",
                        false
                    )
                )
            ),
            qField.createElement(
                fField.createElement(
                    BigNumbers.init__(
                        hex"0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801",
                        false
                    )
                ),
                fField.createElement(
                    BigNumbers.init__(
                        hex"0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be",
                        false
                    )
                )
            )
        );


    /// @notice Restituisce il modulo primo p della curva ellittica
    /// @return Il valore primo come BigNumber
    function get_prime() public view returns (BigNumber memory) {
        return prime;
    }

    /// @notice Restituisce l'ordine dei sottogruppi della curva
    /// @return L'ordine della curva come BigNumber
    function get_order() public view returns (BigNumber memory){
        return order;
    }

    /// @notice Restituisce il generatore del gruppo G_0 in Zp
    /// @return Il punto g0
    function get_g0() public view returns (Point_Zp memory) {
        return g0;
    }

    /// @notice Restituisce il generatore del gruppo G_1
    /// @return Il punto g1
    function get_g1() public view returns (Point_Zp_2 memory) {
        return g1;
    }

    /// @notice Verifica se un punto si trova sulla curva in Zp
    /// @param point Il punto da verificare
    /// @return True se il punto è sulla curva, False altrimenti
    function isOnCurve(Point_Zp memory point) public view returns (bool) {
        Zp memory l = fField.mul(point.y, point.y);
        Zp memory r = fField.sum(
            fField.mul(fField.mul(point.x, point.x), point.x),
            fField.mul_nonres(fField.four())
        );
        return fField.equals(l, r);
    }

    /// @notice Verifica se un punto si trova sulla curva twisted in Zp_2
    /// @param point Il punto twist da verificare
    /// @return True se il punto è sulla curva twist, False altrimenti
    function isOnCurveTwist(
        Point_Zp_2 memory point
    ) public view returns (bool) {
        if (point.pointType == PointType_2.PointAtInfinity) return false;
        Zp_2 memory l = qField.mul(point.y, point.y);
        Zp_2 memory r = qField.sum(
            qField.mul(qField.mul(point.x, point.x), point.x),
            qField.mul_nonres(qField.four())
        );
        return qField.equals(l, r);
    }

    /// @notice Verifica se un punto si trova sulla curva in Zp_12
    /// @param point Il punto da verificare nel campo esteso Zp_12
    /// @return True se il punto è sulla curva, False altrimenti
    function isOnCurve_12(Point_Zp_12 memory point) public view returns (bool) {
        if (point.pointType == PointType_12.PointAtInfinity) return false;
        Zp_12 memory l = tField.mul(point.y, point.y);
        Zp_12 memory r = tField.sum(
            tField.mul(tField.mul(point.x, point.x), point.x),
            tField.four()
        );
        return tField.equals(l, r);
    }

    /// @notice Controlla se un punto su Zp appartiene al sottogruppo con l'ordine specificato
    /// @param point Il punto da verificare
    /// @return True se il punto appartiene al sottogruppo, False altrimenti
    function Subgroup_0Check(Point_Zp memory point) public view returns (bool) {
        return pZp.multiply(order, point).pointType == PointType.PointAtInfinity;
    }

    /// @notice Controlla se un punto su Zp_2 appartiene al sottogruppo con l'ordine specificato
    /// @param point Il punto da verificare nel campo esteso Zp_2
    /// @return True se il punto appartiene al sottogruppo, False altrimenti
    function Subgroup_1Check(
        Point_Zp_2 memory point
    ) public view returns (bool) {
        return pZp_2.multiply(order, point).pointType == PointType_2.PointAtInfinity;
    }

    /// @notice Converte un punto twist su Zp_2 in un punto corrispondente su Zp_12
    /// @param point Il punto twist su Zp_2 da convertire
    /// @return Il punto in Zp_12 risultante dalla conversione
    function untwist(
        Point_Zp_2 memory point
    ) public view returns (Point_Zp_12 memory) {
        Zp_6 memory a = sField.createElement(
            qField.zero(),
            qField.createElement(fField.one(), fField.zero()),
            qField.zero()
        );
        Zp_12 memory x = tField.createElement(
            sField.createElement(point.x, qField.zero(), qField.zero()),
            sField.zero()
        );
        Zp_12 memory y = tField.createElement(
            sField.createElement(point.y, qField.zero(), qField.zero()),
            sField.zero()
        );
        return
            pZp_12.newPoint(
                tField.mul(
                    x,
                    tField.inverse(tField.createElement(a, sField.zero()))
                ),
                tField.mul(
                    y,
                    tField.inverse(tField.createElement(sField.zero(), a))
                )
            );
    }

    /// @notice Calcola la tangente l_r,r e la retta v_2r necessarie per il miller loop
    /// @param r Il punto twist nel campo Zp_2
    /// @param p Il punto di applicazione delle rette su Zp
    /// @return Il rapporto tra la tangente e la retta applicato a p come elemento di Zp_12
    function doubleEval(
        Point_Zp_2 memory r,
        Point_Zp memory p
    ) public view returns (Zp_12 memory) {
        Point_Zp_12 memory r_twist = untwist(r);
        Zp_12 memory slope = tField.mul(
            tField.mul(tField.mul(tField.three(), r_twist.x), r_twist.x),
            tField.inverse(tField.mul(tField.two(), r_twist.y))
        );
        Zp_12 memory v = tField.sub(r_twist.y, tField.mul(slope, r_twist.x));
        Zp_12 memory t0 = tField.fromZp(p.y);
        Zp_12 memory t1 = tField.mul(tField.fromZp(p.x), slope);
        return tField.sub(tField.sub(t0, t1), v);
    }

    /// @notice Calcola le rette l_r,q e v_r+q necessarie per il miller loop
    /// @param r Il primo punto twist su Zp_2
    /// @param q Il secondo punto twist su Zp_2
    /// @param p Il punto di applicazione delle rette su Zp
    /// @return Il rapporto tra le rette applicato a p come elemento di Zp_12
    function addEval(
        Point_Zp_2 memory r,
        Point_Zp_2 memory q,
        Point_Zp memory p
    ) public view returns (Zp_12 memory) {
        require(!(qField.equals(r.x, q.x) && qField.equals(r.y, q.y)));
        Point_Zp_12 memory r_twist = untwist(r);
        Point_Zp_12 memory q_twist = untwist(q);
        if (
            tField.equals(r_twist.x, q_twist.x) &&
            !tField.equals(r_twist.y, q_twist.y)
        ) {
            return tField.sub(tField.fromZp(p.x), r_twist.x);
        } else {
            return _addEval(r_twist, q_twist, p);
        }
    }

    /// @notice Funzione helper per calcolare le rette l_r,q e v_r+q
    /// @param r Il primo punto twist in Zp_12
    /// @param q Il secondo punto twist in Zp_12
    /// @param p Il punto di applicazione delle rette in Zp
    /// @return Il rapporto tra le rette applicato a p come elemento di Zp_12
    function _addEval(
        Point_Zp_12 memory r,
        Point_Zp_12 memory q,
        Point_Zp memory p
    ) public view returns (Zp_12 memory) {
        Zp_12 memory slope = tField.mul(
            tField.sub(q.y, r.y),
            tField.inverse(tField.sub(q.x, r.x))
        );
        Zp_12 memory v = tField.mul(
            tField.sub(tField.mul(q.y, r.x), tField.mul(r.y, q.x)),
            tField.inverse(tField.sub(r.x, q.x))
        );
        Zp_12 memory t0 = tField.fromZp(p.y);
        Zp_12 memory t1 = tField.mul(tField.fromZp(p.x), slope);
        return tField.sub(tField.sub(t0, t1), v);
    }

    /// @notice Esegue l'algoritmo di Miller necessario per il pairing
    /// @param p Il punto su Zp
    /// @param q Il punto twist su Zp_2
    /// @return Il risultato del Miller loop in Zp_12
    function miller(
        Point_Zp memory p,
        Point_Zp_2 memory q
    ) public view returns (Zp_12 memory) {
        return
            miller_iterate(
                p,
                q,
                q,
                GetBits.get_millerBits(X)
            );
    }

    /// @notice Iterazione dell'algoritmo di Miller per calcolare il pairing
    /// @param p Il punto su Zp
    /// @param q Punto twist su Zp_2
    /// @param r Punto twist iniziale
    /// @param bits Array di bit del parametro X della curva
    /// @return Il risultato del Miller loop in Zp_12
    function miller_iterate(
        Point_Zp memory p,
        Point_Zp_2 memory q,
        Point_Zp_2 memory r,
        bool[] memory bits
    ) public view returns (Zp_12 memory) {
        Zp_12 memory acc = tField.one();
        for (uint256 i = 0; i < bits.length; i++) {
            acc = tField.mul(acc, acc);
            acc = tField.mul(acc, doubleEval(r, p));
            r = pZp_2.double(r);
            if (bits[i]) {
                acc = tField.mul(acc, addEval(r, q, p));
                r = pZp_2.add(r, q);
            }
        }
        return acc;
    }

    /// @notice Esegue un pairing tra i punti p e q
    /// @param p Punto su Zp
    /// @param q Punto twist su Zp_2
    /// @return Il risultato del pairing in Zp_12
    function pairing(
        Point_Zp memory p,
        Point_Zp_2 memory q
    ) public view returns (Zp_12 memory) {
        if (
            p.pointType == PointType.PointAtInfinity ||
            q.pointType == PointType_2.PointAtInfinity
        ) return tField.zero();
        require (isOnCurve(p) && isOnCurveTwist(q));
        Zp_12 memory result = miller(p, q);
        BigNumber memory e0 = BigNumbers.init__(hex"02a437a4b8c35fc74bd278eaa22f25e9e2dc90e50e7046b466e59e49349e8bd050a62cfd16ddca6ef53149330978ef011d68619c86185c7b292e85a87091a04966bf91ed3e71b743162c338362113cfd7ced6b1d76382eab26aa00001c718e3a", false);
        BigNumber memory e1 = BigNumbers.init__(hex"126e3a9ce609a1f49cc5d7911d10f22d47e8f4c8a61d4bf5d877014b55f605ec38b8f441e075c538a5d6456a69c7b7a84c946d480f7d91568530d98be187dcd0112c1716c29c69f8d8d26942fd6e5df34f80b646e303f8495f8c07454bb88cefbbcb4b30a9edccf5dcd2baf7616d1d8e1e24340abd7a0b065ad579101c2383ae97d6e42a21de3a393c71fbaa2a96fe7ecc060dc041645a04d8b589e2ee0ae8ef66f64fc39e38ce491e59479f2f064a169ed7be126453c60ea9e7da88f87a48cffe36be19d62ceb29abcf639327368d0e2ff6757720d8753cc53bc216c89d1104ac1a5e1d016ea912bfab48acaa3112c3fafee728bc65bc6e626bf75d31b1e2224a8eb96aa99bd7b3ab5b8c6b95843e289a0f3f4bf2dec6c98463c0705d68", false);
        BigNumber memory e2 = BigNumbers.init__(hex"000f686b3d807d01c0bd38c3195c899ed3cde88eeb996ca394506632528d6a9a2f230063cf081517f68f7764c28b6f8ae5a72bce8d63cb9f827eca0ba621315b2076995003fc77a17988f8761bdc51dc2378b9039096d1b767f17fcbde783765915c97f36c6f18212ed0b283ed237db421d160aeb6a1e79983774940996754c8c71a2629b0dea236905ce937335d5b68fa9912aae208ccf1e516c3f438e3ba79", false);
        Zp_12 memory t0 = tField.exp(result, e0);
        Zp_12 memory t1 = tField.exp(result, e1);
        Zp_12 memory t2 = tField.exp(result, e2);
        return tField.mul(tField.mul(t0, t1), t2);
    }

    /// @notice Verifica la correttezza di una firma data
    /// @param pk La chiave pubblica come punto su Zp
    /// @param hash Hash del messaggio come punto twist su Zp_2
    /// @param sig Firma del messaggio come punto twist su Zp_2
    /// @return True se la firma è valida, False altrimenti
    function verify(Point_Zp memory pk, Point_Zp_2 memory hash, Point_Zp_2 memory sig) public view returns (bool) {
        return tField.equals(pairing(g0, sig), pairing(pk, hash));
    }
}
