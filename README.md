# UniformPointVisualizer [![GitHub Pages Deploy](https://github.com/CaseyNelson314/UniformPointVisualizer/actions/workflows/deploy.yml/badge.svg)](https://github.com/CaseyNelson314/UniformPointVisualizer/actions/workflows/deploy.yml)

## Overview

Visualization of uniformly distributed points on a sphere Web application.

球面上に一様に分布された点の可視化 Web アプリケーション。

## Demo

<https://caseynelson314.github.io/UniformPointVisualizer>

![Animationsd](https://github.com/CaseyNelson314/UniformPointVisualizer/assets/91818705/f2260465-836e-493a-9c83-f69ca1389678)

## Description

By placing points on a spiral on the sphere, a uniform and arbitrary number of points can be placed on the sphere. (Generalized Spiral Set)

This algorithm was used to simulate the lines of electric force emitted from a point charge in three-dimensional space.

球面上の螺旋に点を配置することで、球面上に一様かつ任意の個数の点を配置することができる。(一般化螺旋集合)

点電荷から出る電気力線を、三次元空間でシミュレートする際にこのアルゴリズムを使用した。

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
