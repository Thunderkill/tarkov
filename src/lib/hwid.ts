import { Md5 } from 'ts-md5/dist/md5';
/**
 * Generate a random EFT compatible Hardware ID.
 * @returns {String} EFT compatible Hardware ID.
 */
export default function generate_hwid(): string {
  /**
   * Return shortened md5 value.
   * @private
   */
  function short_md5() {
    let hash = random_md5();
    return hash.substring(0, hash.length - 8);
  }

  return `#1-${random_md5()}:${random_md5()}:${random_md5()}-${random_md5()}-${random_md5()}-${random_md5()}-${random_md5()}-${short_md5()}`;
}

/**
 * Create random md5 value.
 * @private
 */
function random_md5(): string {
  return Md5.hashStr(Math.random().toString()) as string;
}