import { Vector2 } from "three";
import { KeyCode } from "../utils/KeyCodes";


interface IKeyData {
    isPressed: boolean;
    onKeyPress: CustomEvent;
}

const KeysData: Map<KeyCode, IKeyData> = new Map<KeyCode, IKeyData>();

Object.keys(KeyCode).forEach((key: string) => KeysData.set(key as KeyCode, {
    isPressed: false,
    onKeyPress: new CustomEvent(`KeyPress${key}`),
}));

const InitializeKeysData = () => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!checkValidKey(e.code)) {
            return;
        }
        const currentKeyData = KeysData.get(e.code as KeyCode);

        // raise event on key press
        if (!currentKeyData!.isPressed) {
            const keyPressEvent = KeysData.get(e.code as KeyCode)!.onKeyPress;
            document.dispatchEvent(keyPressEvent);
        }

        KeysData.set(e.code as KeyCode, {
            ...currentKeyData!,
            isPressed: true,
        });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        if (!checkValidKey(e.code)) {
            return;
        }

        KeysData.set(e.code as KeyCode, {
            ...KeysData.get(e.code as KeyCode)!,
            isPressed: false,
        });
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    console.log("Keyboard input initialized");
};

InitializeKeysData();

const checkValidKey = (code: string): boolean => {
    if (!KeysData.has(code as KeyCode)) {
        console.error(`${code} key not registered`);
        return false;
    }
    return true;
};

const IsKeyPressed = (key: KeyCode): boolean => {
    // if (!checkValidKey(key as string)) {
    //     return false;
    // }
    return KeysData.get(key)?.isPressed ?? false;
};

/**
 * Get an array of 2 elements, representing the wasd pressed input.
 * An element can be either -1, 0 or 1.
 */
const getWASDInput = (): Vector2 => new Vector2(
    (IsKeyPressed(KeyCode.KeyA) ? -1 : 0) + (IsKeyPressed(KeyCode.KeyD) ? 1 : 0),
    (IsKeyPressed(KeyCode.KeyS) ? -1 : 0) + (IsKeyPressed(KeyCode.KeyW) ? 1 : 0));

const AddOnKeyPressHandler = (key: KeyCode, handler: () => void) => {
    if (!checkValidKey(key as string)) {
        return;
    }
    document.addEventListener(`KeyPress${key}`, handler);
}
const RemoveOnKeyPressHandler = (key: KeyCode, handler: () => void) => {
    if (!checkValidKey(key as string)) {
        return;
    }
    document.removeEventListener(`KeyPress${key}`, handler);
}

export const KeyboardInput = {
    IsKeyPressed,
    WASD: {
        /**
         * Get an array of 2 elements, representing the wasd pressed input.
         * An element can be either -1, 0 or 1.
         */
        getVector: getWASDInput,
        /**
         * Whether or not W, A, S or D keys are pressed
         */
        anyKeyPressed: () => IsKeyPressed(KeyCode.KeyA) || IsKeyPressed(KeyCode.KeyD) ||
                             IsKeyPressed(KeyCode.KeyW) || IsKeyPressed(KeyCode.KeyS),
    },
    AddOnKeyPressHandler,
    RemoveOnKeyPressHandler
};