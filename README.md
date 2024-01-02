# UniformPointVisualizer [![GitHub Pages Deploy](https://github.com/CaseyNelson314/UniformPointVisualizer/actions/workflows/deploy.yml/badge.svg)](https://github.com/CaseyNelson314/UniformPointVisualizer/actions/workflows/deploy.yml)

## Overview

Visualization of uniformly distributed points on a sphere Web application.

球面上に一様に分布された点の可視化アプリケーション。

## Demo

<https://caseynelson314.github.io/UniformPointVisualizer>

![Animationsd](https://github.com/CaseyNelson314/UniformPointVisualizer/assets/91818705/aebfa5fb-af61-4eb0-bb45-4c0d902bf31c)

## Description

The points are uniformly distributed using the Generalized Spiral Set (GSS). This algorithm can place an arbitrary number of points on the sphere in a roughly uniform manner with a simple calculation.

This algorithm was used to simulate the lines of electric force emitted from a point charge in 3D space.

一般化螺旋集合 (GSS) を用いて点を一様に分布させています。このアルゴリズムは、単純な計算で球面上におおよそ一様、かつ任意の個数の点を配置できます。

点電荷から出る電気力線を、三次元空間でシミュレートする際にこのアルゴリズムを使用しました。

## Local Execute

Require NodeJS

clone

```sh
git clone https://github.com/CaseyNelson314/UniformPointVisualizer.git
cd UniformPointVisualizer
npm install
```

launch local server

```sh
npm run dev
```

## References

1. E.B. SAFF A.B.J. KUIJLAARS  Distributing Many Points on a Sphere (1997)

   <https://perswww.kuleuven.be/~u0017946/publications/Papers97/art97a-Saff-Kuijlaars-MI/Saff-Kuijlaars-MathIntel97.pdf>

2. Atsushi YAMAJI  GSS Generator: A Software to Distribute Many Points with Equal Intervals on an Unit Sphere (2001)

   <https://www.jstage.jst.go.jp/article/geoinformatics/12/1/12_1_3/_pdf/-char/ja>
