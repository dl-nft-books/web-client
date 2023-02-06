<template>
  <div class="bookshelf-cubes">
    <div class="bookshelf-cubes__item bookshelf-cubes__item--top" />
    <div class="bookshelf-cubes__item bookshelf-cubes__item--left" />
    <div class="bookshelf-cubes__item bookshelf-cubes__item--right" />
  </div>
</template>

<style lang="scss" scoped>
.bookshelf-cubes__item {
  width: 100%;
  height: vh(80);
  position: absolute;
  z-index: var(--bg-index);

  --top-cube-index: 0;

  &--top {
    background: url('/images/cube-top.png') no-repeat right top / contain;
    background-size: clamp(toRem(150), 25%, toRem(450));
    height: vh(40);
    top: toRem(110);
    right: 0;
    z-index: var(--top-cube-index);
  }

  &--left {
    background: url('/images/cube-left.png') no-repeat left top / contain;
    background-size: 17%;
    left: 0;
    top: 40%;
  }

  &--right {
    background: url('/images/cube-right.png') no-repeat right bottom / contain;
    width: 90%;
    background-size: 17%;
    bottom: 0;
    right: 0;
  }

  @include respond-to(small) {
    background-size: 70%;
  }
}
</style>
