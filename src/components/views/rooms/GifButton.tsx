/*
Copyright 2024 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import classNames from "classnames";
import React, { type JSX, useContext } from "react";
import { StickerIcon } from "@vector-im/compound-design-tokens/assets/web/icons";

import { _t } from "../../../languageHandler";
import ContextMenu, { aboveLeftOf, type MenuProps, useContextMenu } from "../../structures/ContextMenu";
import GifPicker from "../emojipicker/GifPicker";
import { CollapsibleButton } from "./CollapsibleButton";
import { OverflowMenuContext } from "./MessageComposerButtons";

interface IGifButtonProps {
    addGif: (url: string) => boolean;
    menuPosition?: MenuProps;
    className?: string;
}

export function GifButton({ addGif, menuPosition, className }: IGifButtonProps): JSX.Element {
    const overflowMenuCloser = useContext(OverflowMenuContext);
    const [menuDisplayed, button, openMenu, closeMenu] = useContextMenu();

    let contextMenu: React.ReactElement | null = null;
    if (menuDisplayed && button.current) {
        const position = menuPosition ?? aboveLeftOf(button.current.getBoundingClientRect());
        const onFinished = (): void => {
            closeMenu();
            overflowMenuCloser?.();
        };

        contextMenu = (
            <ContextMenu {...position} onFinished={onFinished} managed={false} focusLock>
                <GifPicker onChoose={addGif} onFinished={onFinished} />
            </ContextMenu>
        );
    }

    const computedClassName = classNames("mx_EmojiButton", className, {
        mx_EmojiButton_highlight: menuDisplayed,
    });

    return (
        <>
            <CollapsibleButton
                className={computedClassName}
                onClick={openMenu}
                title={_t("common|gif")}
                inputRef={button}
            >
                <StickerIcon />
            </CollapsibleButton>

            {contextMenu}
        </>
    );
}
