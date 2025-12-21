// src/utils/happyWave.js

/**
 * 摇晃效果 (Shake)
 * 当波纹模式选择 "Shake" 时调用此函数
 */
export const showShakeEffect = (node) => {
    // 移除旧动画以允许重播
    node.style.animation = 'none';
    // 强制浏览器重绘 (Reflow)
    void node.offsetWidth;
    // 应用动画
    node.style.animation = 'waveEffectShake 0.4s cubic-bezier(.36,.07,.19,.97) both';

    // 动画结束后清理
    setTimeout(() => { node.style.animation = ''; }, 400);
};