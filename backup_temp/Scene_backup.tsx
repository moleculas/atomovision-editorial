'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Float, Html } from '@react-three/drei'
import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ARCHILLECT_CONFIG, SCENE_CONFIG } from '@/constants'
import { useNavigationStore } from '@/store/navigation'

// ESTE ES EL BACKUP DEL ESTADO ACTUAL ANTES DE RESTAURAR
// Variable global para almacenar los archivos
let archillectFiles: string[] = []

// ... resto del código actual como backup
