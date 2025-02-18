import { useEffect, useRef } from "react";
import * as THREE from "three";
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Group} from "three";
const ThreeBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scene = useRef<THREE.Scene>(new THREE.Scene());
    const camera = useRef<THREE.PerspectiveCamera>(null);
    const renderer = useRef<THREE.WebGLRenderer>(null);
    const cube = useRef<THREE.Mesh>(null);
    const animationId = useRef<number>(null);
    const model = useRef<Group>();

    useEffect(() => {
        // 确保 containerRef 存在
        if (!containerRef.current) return;

        // 初始化相机
        camera.current = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.current.position.z = 5;

        // 初始化渲染器
        renderer.current = new THREE.WebGLRenderer({ alpha: true });
        renderer.current.setSize(window.innerWidth, window.innerHeight);
        renderer.current.setPixelRatio(window.devicePixelRatio);

        // 将渲染器的 DOM 元素添加到容器
        containerRef.current.appendChild(renderer.current.domElement);

        // 定义窗口调整处理函数
        const handleResize = () => {
            if (!camera.current || !renderer.current) return;
            camera.current.aspect = window.innerWidth / window.innerHeight;
            camera.current.updateProjectionMatrix();
            renderer.current.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);
        camera.current
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 环境光
        scene.current.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 方向光
        directionalLight.position.set(2, 0, 2).normalize();
        scene.current.add(directionalLight);
        
        //外部模型
        const loader=new GLTFLoader()
        loader.load(
            `http://localhost:9000/three-d/2.glb`,
            function (gltf){
                
                gltf.scene.position.set(2, 0, 2);
                gltf.scene.scale.set(0.5, 0.5, 0.5);
                
                scene.current.add(gltf.scene)
                model.current = gltf.scene;
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% 已加载');
            },
            function (error) {
                console.error('模型加载出错：', error)
            }
            )
        
        // 创建立方体
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        cube.current = new THREE.Mesh(geometry, material);
       // scene.current.add(cube.current);

        // 动画循环
        const animate = () => {
            animationId.current = requestAnimationFrame(animate);
            if (cube.current) {
                cube.current.rotation.x += 0.01;
                cube.current.rotation.y += 0.01;
            }
            if (model.current) {
            }
            renderer.current?.render(scene.current, camera.current!);
        };
        animate();

        // 清理函数
        return () => {
            window.removeEventListener("resize", handleResize);
            if (animationId.current) {
                cancelAnimationFrame(animationId.current);
            }
            if (renderer.current) {
                renderer.current.dispose();
                if (containerRef.current?.contains(renderer.current.domElement)) {
                    containerRef.current.removeChild(renderer.current.domElement);
                }
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed top-0 left-0 w-screen h-screen z-10"
        />
    );
};

export default ThreeBackground;