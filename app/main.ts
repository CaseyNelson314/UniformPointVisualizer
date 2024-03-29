import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GSS } from './gss';

const main = () => {

    // シーン
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);


    // レンダラー
    const dom = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(dom.offsetWidth, dom.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    dom.appendChild(renderer.domElement);


    // カメラ
    const camera = new THREE.PerspectiveCamera(75, dom.offsetWidth / dom.offsetHeight, 0.1, 1000);
    camera.position.set(1, 1.5, 1);
    scene.add(camera);


    // リサイズ処理
    {
        const resizeObserver = new ResizeObserver((entries) => {
            const { width, height } = entries[0]!.contentRect;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });
        resizeObserver.observe(dom);
    }


    // カメラコントローラー
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;    // パン操作無効
    controls.autoRotate = true;    // 自動回転
    controls.autoRotateSpeed = 1;  // 自動回転の速度
    controls.enableDamping = true; // 視点の移動を滑らかにする
    controls.dampingFactor = 0.2;  // 滑らか度合い


    // 球
    {
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
        const sphereGeometry = new THREE.SphereGeometry(1, 40, 40);
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);
    }


    // 点群
    const pointGroup = new THREE.Group();
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphereGeometry = new THREE.SphereGeometry(0.02, 30, 30);

    const updatePoints = (n: number) => {

        scene.remove(pointGroup);

        pointGroup.children = [];

        // 点群を生成
        const points = GSS(n);


        // 電群を示す球を生成
        for (const point of points) {
            const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            mesh.position.copy(point);
            pointGroup.add(mesh);
        }


        // 点群を結ぶ
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points.map(p => p.multiplyScalar(0.99)));  // 球との重なりを防ぐために少し内側にする
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

        // スライダーと入力ボックスの値を同期
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
