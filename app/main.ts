import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


// 球面上に点を一様分布する正規ベクトルを生成し、コールバック関数に渡す
const GSS = (n: number, functor: (vector: THREE.Vector3) => void) => {

    // 一般化螺旋集合を用いた球面上の点の一様分布
    // 参考論文: https://www.jstage.jst.go.jp/article/geoinformatics/12/1/12_1_3/_pdf/-char/ja

    if (n < 1) return;

    if (n === 1) {
        functor(new THREE.Vector3(0, 1, 0));
        return;
    }

    let phi = 0;
    for (let k = 1; k <= n; k++) {

        // 2.4 式(1)より パラメータ h_k を算出
        const h = -1 + 2 * (k - 1) / (n - 1);

        // 2.4 式(2)より パラメータ theta_k を算出
        const theta = Math.acos(h);

        // 2.4 式(3)より パラメータ phi_k を算出
        if (h * h === 1)
            phi = 0;  // ゼロ除算対策
        else
            phi = phi + 3.6 / Math.sqrt(n) / Math.sqrt(1 - h * h);

        // 直交座標系に変換
        const x = Math.sin(theta) * Math.cos(phi);
        const z = Math.sin(theta) * Math.sin(phi);
        const y = Math.cos(theta);

        functor(new THREE.Vector3(x, y, z));

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


    // カメラコントローラー
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;    // 自動回転
    controls.autoRotateSpeed = 1;  // 自動回転の速度
    controls.enableDamping = true; // 視点の移動を滑らかにする
    controls.dampingFactor = 0.2;  // 滑らか度合い


    // 球
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, transparent: true, opacity: 0.6 });
    const sphereGeometry = new THREE.SphereGeometry(1, 40, 40);
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);


    const pointGroup = new THREE.Group();
    const pointsUpdate = (n: number) => {

        scene.remove(pointGroup);

        // ジオメトリ破棄
        for (const point of pointGroup.children) {
            if (point instanceof THREE.Mesh)
                point.geometry.dispose();
        }
        pointGroup.children = [];

        const array: THREE.Vector3[] = [];
        
        // 点群を生成
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const sphereGeometry = new THREE.SphereGeometry(0.02, 10, 10);
        GSS(n, (vector: THREE.Vector3) => {

            const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            mesh.position.copy(vector);
            pointGroup.add(mesh);

            array.push(vector.multiplyScalar(0.998));  // 球面上の点を少しずらす (球との重なり防止)
        });

        // 点群を結ぶ
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(array);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        pointGroup.add(line);

        scene.add(pointGroup);
    };


    // スライダー、入力ボックス同期
    const slider = document.getElementById('point_count_slider') as HTMLInputElement;
    const input = document.getElementById('point_count_number_input') as HTMLInputElement;

    input.value = slider.value;
    pointsUpdate(input.valueAsNumber);

    slider.addEventListener('input', () => {
        input.value = slider.value;
        pointsUpdate(input.valueAsNumber);
    });
    input.addEventListener('input', () => {
        slider.value = input.value;
        pointsUpdate(slider.valueAsNumber);
    });

    const animate = () => {

        requestAnimationFrame(animate);

        renderer.render(scene, camera);

        controls.update();

    };


    animate();

}

window.addEventListener('load', main);
