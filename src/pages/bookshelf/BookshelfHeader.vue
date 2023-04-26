<template>
  <header class="bookshelf-header">
    <div class="bookshelf-header__wrapper">
      <h1 class="bookshelf-header__title">
        {{ $t('bookshelf-header.title') }}
      </h1>
      <h3 class="bookshelf-header__subtitle">
        {{ $t('bookshelf-header.subtitle') }}
      </h3>
    </div>
    <img
      class="bookshelf-header__background"
      src="/images/book-background.png"
      :draggable="false"
      :alt="$t('bookshelf-header.title')"
    />
  </header>
</template>

<style lang="scss" scoped>
.bookshelf-header {
  display: flex;
  position: relative;
  justify-content: center;
  background: url('/images/floating-letters.png') no-repeat right top / contain;
  background-size: clamp(toRem(250), 50%, toRem(800));

  @include respond-to(small) {
    padding-top: toRem(20);
  }
}

.bookshelf-header__background {
  object-fit: cover;
  object-position: top;
  width: clamp(toRem(250), 70%, toRem(900));
  user-select: none;
  pointer-events: none;
  margin-top: toRem(-200);

  @include respond-to(medium) {
    margin-top: 0;
  }
}

.bookshelf-header__title {
  text-transform: uppercase;
  font-weight: 800;
  font-size: clamp(toRem(24), 6vw, toRem(64));
  line-height: 110%;
  letter-spacing: 0.055em;

  @include respond-to(medium) {
    font-size: clamp(toRem(24), 6vw, toRem(40));
  }
}

.bookshelf-header__subtitle {
  font-size: clamp(toRem(16), 6vw, toRem(22));
  line-height: 120%;
  color: var(--primary-main);

  @include respond-to(small) {
    font-size: toRem(16);
  }
}

.bookshelf-header__wrapper {
  background-color: var(--background-primary-dark);
  height: min-content;
  position: absolute;
  z-index: var(--z-index-layer-1);
  top: 21%;
  padding: toRem(18) toRem(40);
  border-radius: toRem(10);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(15);
  text-align: center;
}
</style>
