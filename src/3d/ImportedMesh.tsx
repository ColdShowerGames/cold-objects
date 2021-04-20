import { GroupProps } from "@react-three/fiber";
import React, { ForwardedRef, useMemo } from 'react';
import { Group, Material, Mesh, Object3D } from "three";

interface IImportedMeshProps extends GroupProps {
    object: Object3D
}

interface IMeshData {
    mesh: Mesh
    material: Material
}

export const ImportedMesh = React.forwardRef((
    props: IImportedMeshProps,
    ref: ForwardedRef<Group>) => {

    const childrenMesh = useMemo<IMeshData[]>(() => {
        if (props.object.type !== "Group") {
            return [];
        }
        const meshes: IMeshData[] = props.object.children.filter(child => child.type ===
                                                                          "Mesh")
            .map((child) => ({
                mesh: child as Mesh,
                material: ((child as Mesh).material as Material),
            }));
        return meshes;

    }, [props.object]);

    return (<group {...props} ref={ref} >
        {childrenMesh.map(data => (<mesh key={data.mesh.name}
                                         geometry={data.mesh.geometry}
                                         material={data.material} />))}
    </group >);
});

// /*
// Auto-generated by: https://github.com/pmndrs/gltfjsx
// */
//
// import * as THREE from 'three'
// import React, { useRef } from 'react'
// import { useGLTF } from '@react-three/drei/useGLTF'
//
// import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
//
// type GLTFResult = GLTF & {
//   nodes: {
//     cube: THREE.Mesh
//     cube_1: THREE.Mesh
//   }
//   materials: {
//     white: THREE.MeshStandardMaterial
//     red: THREE.MeshStandardMaterial
//   }
// }
//
// export default function Model(props: JSX.IntrinsicElements['group']) {
//   const group = useRef<THREE.Group>()
//   const { nodes, materials } = useGLTF('/enemy1.gltf') as GLTFResult
//   return (
//     <group ref={group} {...props} dispose={null}>
//       <mesh material={materials.white} geometry={nodes.cube.geometry} />
//       <mesh material={materials.red} geometry={nodes.cube_1.geometry} />
//     </group>
//   )
// }
//
// useGLTF.preload('/enemy1.gltf')

