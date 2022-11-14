<template>
  <div :class="keyboardClass"></div>
</template>

<script>
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";

export default {
  name: "SimpleKeyboard",
  props: {
    keyboardClass: {
      default: "simple-keyboard",
      type: String
    },
    input: {
      type: String
    }
  },
  data: () => ({
    keyboard: null
  }),
  mounted() {
    this.keyboard = new Keyboard(this.keyboardClass, {
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      layout: {
        default: [
          "^ 1 2 3 4 5 6 7 8 9 0 \u00DF \u00B4 {bksp}",
          "{tab} q w e r t z u i o p \u00FC +",
          "{lock} a s d f g h j k l \u00F6 \u00E4 # {enter}",
          "{shift} < y x c v b n m , . - {shift}",
          "@ {space}",
        ],
        shift: [
          '\u00B0 ! " \u00A7 $ % & / ( ) = ? ` {bksp}',
          "{tab} Q W E R T Z U I O P \u00DC *",
          "{lock} A S D F G H J K L \u00D6 \u00C4 ' {enter}",
          "{shift} > Y X C V B N M ; : _ {shift}",
          "@ {space}",
        ],
      },
    });
  },
  methods: {
    onChange(input) {
      this.$emit("onChange", input);
    },
    onKeyPress(button) {
      this.$emit("onKeyPress", button);

      /**
       * If you want to handle the shift and caps lock buttons
       */
      if (button === "{shift}" || button === "{lock}") this.handleShift();
    },
    handleShift() {
      let currentLayout = this.keyboard.options.layoutName;
      let shiftToggle = currentLayout === "default" ? "shift" : "default";

      this.keyboard.setOptions({
        layoutName: shiftToggle
      });
    }
  },
  watch: {
    input(input) {
      this.keyboard.setInput(input);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
