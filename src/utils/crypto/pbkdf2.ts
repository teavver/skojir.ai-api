import sjcl from 'sjcl'
import { PBKDF2Params } from '../../types/PBKDF2Params.js'

/**
 * Derive a key using PBKDF2
 * @param password - User password
 * @param salt - User salt
 * @param iter - Amount of iterations
 * @param keySize - output key size in bits
 */
export const deriveKey = ({ password, salt, iter = 10000, keySize = 256 }: PBKDF2Params): string => {
    const bitArray = sjcl.misc.pbkdf2(password, salt, iter, keySize)
    return sjcl.codec.hex.fromBits(bitArray)
}