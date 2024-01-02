import * as THREE from "three";


/// 一般化螺旋集合を用いて、球面上に点を一様分布する正規ベクトルの配列を生成する。
/// @param n 点の数
/// @param functor コールバック関数
export const GSS = (n: number): THREE.Vector3[] => {

    if (n < 1) return [];


    if (n === 1) {
        return [];
    }


    // 一般化螺旋集合を用いた球面上の点の一様分布
    // https://perswww.kuleuven.be/~u0017946/publications/Papers97/art97a-Saff-Kuijlaars-MI/Saff-Kuijlaars-MathIntel97.pdf
    let phi = 0;
    const vectors: THREE.Vector3[] = [];
    for (let k = 1; k <= n; k++) {

        // P.10 式(8)より パラメータ h_k を算出
        const h = -1 + 2 * (k - 1) / (n - 1);

        // 式(8)より パラメータ theta_k を算出
        const theta = Math.acos(h);

        // 式(8)より パラメータ phi_k を算出
        if (h * h === 1)
            phi = 0;  // ゼロ除算対策
        else
            phi = phi + 3.6 / Math.sqrt(n) / Math.sqrt(1 - h * h);

        // 直交座標系に変換
        const sinTheta = Math.sin(theta);
        const x = sinTheta * Math.cos(phi);
        const z = sinTheta * Math.sin(phi);
        const y = -Math.cos(theta);

        vectors.push(new THREE.Vector3(x, y, z));
    }

    if (n >= 7) {
        // 極の点の補正
        // https://www.jstage.jst.go.jp/article/geoinformatics/12/1/12_1_3/_pdf/-char/ja
        // 極の2点は一様性が損なわれるので、極を囲む点の平均から求める。
        vectors[0] = new THREE.Vector3()
            .add(vectors[1]!)
            .add(vectors[2]!)
            .add(vectors[4]!)
            .add(vectors[5]!)
            .add(vectors[6]!)
            .normalize();

        vectors[n - 1] = new THREE.Vector3()
            .add(vectors[n - 2]!)
            .add(vectors[n - 3]!)
            .add(vectors[n - 4]!)
            .add(vectors[n - 5]!)
            .add(vectors[n - 6]!)
            .normalize();
    }

    return vectors;
}
