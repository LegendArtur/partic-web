/*
Copyright 2024 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React from "react";
import { _t } from "../../../languageHandler";
import AutoHideScrollbar from "../../structures/AutoHideScrollbar";
import Search from "./Search";
import { Key } from "../../../Keyboard";
import SdkConfig from "../../../SdkConfig";

interface IProps {
    onChoose(url: string): boolean;
    onFinished(): void;
}

interface IState {
    filter: string;
    gifs: { url: string; preview: string; title: string }[];
    loading: boolean;
    error: string | null;
}

// Giphy API constants
const GIPHY_API_BASE = "https://api.giphy.com/v1/gifs";
// Fallback key for development - user should configure their own
const DEMO_KEY = "dc6zaTOxFJmzC"; // Legacy public beta key

class GifPicker extends React.Component<IProps, IState> {
    private scrollRef = React.createRef<AutoHideScrollbar<"div">>();
    private searchTimeout: number | undefined;

    public constructor(props: IProps) {
        super(props);

        this.state = {
            filter: "",
            gifs: [],
            loading: false,
            error: null,
        };
    }

    public componentDidMount(): void {
        this.fetchGifs(""); // Fetch trending
    }

    private getApiKey(): string {
        // Try to get from config, fallback to demo key
        // Note: Implementation of reading from config.json via SdkConfig
        const config = SdkConfig.get() as any;
        const key = config["giphy_api_key"];
        if (key && key !== "YOUR_GIPHY_API_KEY") {
            return key;
        }
        return DEMO_KEY;
    }

    private async fetchGifs(query: string) {
        this.setState({ loading: true, error: null });
        const key = this.getApiKey();
        const endpoint = query ? `${GIPHY_API_BASE}/search` : `${GIPHY_API_BASE}/trending`;
        const params = new URLSearchParams({
            api_key: key,
            limit: "20",
            rating: "g",
            q: query,
        });

        try {
            const response = await fetch(`${endpoint}?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`Error fetching GIFs: ${response.statusText}`);
            }
            const data = await response.json();

            const gifs = data.data.map((result: any) => ({
                url: result.images.original.url,
                preview: result.images.fixed_height_small.url,
                title: result.title,
            }));

            this.setState({ gifs, loading: false });
        } catch (err) {
            console.error("Failed to fetch GIFs", err);
            this.setState({
                error: _t("gif_picker|error_fetching"),
                loading: false,
                gifs: []
            });
        }
    }

    private onChangeFilter = (filter: string): void => {
        this.setState({ filter });
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = window.setTimeout(() => {
            this.fetchGifs(filter);
        }, 500); // 500ms debounce
    };

    private onEnterFilter = (): void => {
        // Trigger immediate search or select first result?
        // For now, just ensuring search was triggered
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
            this.fetchGifs(this.state.filter);
        }
    };

    private onClickGif = (url: string): void => {
        this.props.onChoose(url);
        this.props.onFinished();
    };

    private onKeyDown = (event: React.KeyboardEvent): void => {
        if (event.key === Key.ESCAPE) {
            this.props.onFinished();
        }
    };

    public render(): React.ReactNode {
        return (
            <section
                className="mx_EmojiPicker" // Reusing EmojiPicker styles for consistency
                aria-label={_t("GIFs")}
                onKeyDown={this.onKeyDown}
            >

                <Search
                    query={this.state.filter}
                    onChange={this.onChangeFilter}
                    onEnter={this.onEnterFilter}
                    onKeyDown={this.onKeyDown}
                />

                <AutoHideScrollbar
                    ref={this.scrollRef}
                    className="mx_EmojiPicker_body"
                >
                    <div style={{ padding: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {this.state.loading && <div>{_t("common|loading")}</div>}
                        {this.state.error && <div className="error">{this.state.error}</div>}

                        {!this.state.loading && this.state.gifs.map((gif) => (
                            <div
                                key={gif.url}
                                style={{ cursor: "pointer", borderRadius: "8px", overflow: "hidden" }}
                                onClick={() => this.onClickGif(gif.url)}
                            >
                                <img
                                    src={gif.preview}
                                    alt={gif.title}
                                    style={{ width: "100%", height: "auto", display: "block" }}
                                />
                            </div>
                        ))}

                        {!this.state.loading && this.state.gifs.length === 0 && !this.state.error && (
                            <div>{_t("gif_picker|no_results")}</div>
                        )}
                    </div>
                </AutoHideScrollbar>
            </section>
        );
    }
}

export default GifPicker;
