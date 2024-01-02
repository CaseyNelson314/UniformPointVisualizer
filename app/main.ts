import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


/// 一般化螺旋集合を用いて、球面上に点を一様分布する正規ベクトルを生成し、コールバック関数に渡す
/// @param n 点の数
/// @param functor コールバック関数
const GSS = (n: number, functor: (vector: THREE.Vector3) => void) => {

    if (n < 1) return;


    if (n === 1) {
        functor(new THREE.Vector3(0, 1, 0));
        return;
    }


    // 一般化螺旋集合を用いた球面上の点の一様分布
    // https://perswww.kuleuven.be/~u0017946/publications/Papers97/art97a-Saff-Kuijlaars-MI/Saff-Kuijlaars-MathIntel97.pdf
    let phi = 0;
    const kVector = (k: number) => {

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

        return new THREE.Vector3(x, y, z);

    }


    // 極の点の補正
    // https://www.jstage.jst.go.jp/article/geoinformatics/12/1/12_1_3/_pdf/-char/ja
    // 極の2点は一様性が損なわれるので、極を囲む点の平均から求める。
    if (n >= (6 + 1) * 2) {

        // 先頭
        {
            // a4 だけ平均値算出時に使用しないので for を使わずに個別に処理
            const a2 = kVector(2);
            const a3 = kVector(3);
            const a4 = kVector(4);
            const a5 = kVector(5);
            const a6 = kVector(6);
            const a7 = kVector(7);

            // 式(4) a_1 = (a_2 + a_3 + a_5 + a_6 + a_7) / 5
            const a1 = new THREE.Vector3().add(a2).add(a3).add(a5).add(a6).add(a7).normalize();

            functor(a1);
            functor(a2);
            functor(a3);
            functor(a4);
            functor(a5);
            functor(a6);
            functor(a7);
        }

        // 中間
        {
            for (let k = 7 + 1; k < n - 7 + 1; k++) {
                functor(kVector(k));
            };
        }

        // 末尾
        {
            const an6 = kVector(n - 6);
            const an5 = kVector(n - 5);
            const an4 = kVector(n - 4);
            const an3 = kVector(n - 3);
            const an2 = kVector(n - 2);
            const an1 = kVector(n - 1);

            // 式(5) a_n = (a_{n-1} + a_{n-2} + a_{n-3} + a_{n-4} + a_{n-5} + a_{n-6}) / 5
            const an = new THREE.Vector3().add(an2).add(an3).add(an4).add(an5).add(an6).normalize();

            functor(an6);
            functor(an5);
            functor(an4);
            functor(an3);
            functor(an2);
            functor(an1);
            functor(an);
        }

    }
    else {

        // 一様分布
        for (let k = 1; k <= n; k++) {
            functor(kVector(k));
        }

    }

}

const main = () => {

    // シーン
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x38393b);


    // レンダラー
    const dom = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(dom.offsetWidth, dom.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    dom.appendChild(renderer.domElement);


    // カメラ
    const camera = new THREE.PerspectiveCamera(75, dom.offsetWidth / dom.offsetHeight, 0.1, 1000);
    camera.position.set(1, 1.5, 1);
    scene.add(camera);


    // リサイズ処理
    const resizeObserver = new ResizeObserver((entries) => {
        if (entries.length === 0) {
            return;
        }
        const { width, height } = entries[0]!.contentRect;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
    resizeObserver.observe(dom);


    // カメラコントローラー
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;    // パン操作無効
    controls.autoRotate = true;    // 自動回転
    controls.autoRotateSpeed = 1;  // 自動回転の速度
    controls.enableDamping = true; // 視点の移動を滑らかにする
    controls.dampingFactor = 0.2;  // 滑らか度合い


    // 球
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, transparent: true, opacity: 0.7 });
    const sphereGeometry = new THREE.SphereGeometry(1, 40, 40);
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);


    // 点群
    const pointGroup = new THREE.Group();
    const updatePoints = (n: number) => {

        scene.remove(pointGroup);

        // ジオメトリ破棄
        for (const point of pointGroup.children) {
            if (point instanceof THREE.Mesh)
                point.geometry.dispose();
            else if (point instanceof THREE.Line)
                point.geometry.dispose();
        }
        pointGroup.children = [];

        const points: THREE.Vector3[] = [];

        // 点群を生成
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const sphereGeometry = new THREE.SphereGeometry(0.02, 10, 10);
        GSS(n, (vector: THREE.Vector3) => {

            const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            mesh.position.copy(vector);
            pointGroup.add(mesh);

            points.push(vector.multiplyScalar(0.998));  // 球面上の点を少しずらす (球との重なり防止)
        });

        // 点群を結ぶ
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        pointGroup.add(line);

        scene.add(pointGroup);
    };


    // スライダー、入力ボックス
    {
        const slider = document.getElementById('point_count_slider') as HTMLInputElement;
        const input = document.getElementById('point_count_number_input') as HTMLInputElement;

        input.value = slider.value;
        updatePoints(input.valueAsNumber);

        slider.addEventListener('input', () => {
            input.value = slider.value;
            updatePoints(input.valueAsNumber);
        });
        input.addEventListener('input', () => {
            slider.value = input.value;
            updatePoints(slider.valueAsNumber);
        });
    }


    // メインループ
    const animate = () => {

        requestAnimationFrame(animate);

        renderer.render(scene, camera);

        controls.update();

    };


    animate();

}

window.addEventListener('load', main);
