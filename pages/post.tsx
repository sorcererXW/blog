import * as React from 'react';
import styled from "styled-components";
import AppLayout from "../component/AppLayout";
import MetaHead from "../component/MetaHead";
import NotionBlockList from "../component/notion/base/NotionBlockList";
import PageHeaderBlock from "../component/notion/PageHeaderBlock";
import {loadFullPageChunk, recordListToTree, BlockNode} from "../api/notion";

const Content = styled.div`
  width: 768px;
  max-width: 90%;
  margin: auto;
  display: flex;
  flex-direction: column;
`;

const CoverImage = styled.img`
  width: 100%;
  height: 30vh;
  object-fit: cover;
  object-position: center 0;
`;

interface IProps {
    blockQuery: string,
    // data: BlockNode[]
}

interface IState {
    data: BlockNode[]
}

export default class Post extends React.Component<IProps, IState> {
    static async getInitialProps({query}) {
        const pageId = query.block;
        return {
            blockQuery: pageId,
            // data: recordListToTree(await loadFullPageChunk(pageId))
        }
    }

    constructor(props: any) {
        super(props);
        this.state = {
            data: []
        }
    }

    async componentDidMount(): Promise<void> {
        const pageId = this.props.blockQuery;
        this.setState({
            data: recordListToTree(await loadFullPageChunk(pageId))
        });
    }

    public render(): React.ReactNode {
        console.log(this.state.data);
        if (this.state.data.length === 0) {
            return <div>
                <MetaHead/>
                <AppLayout>
                </AppLayout>
            </div>
        }
        return <div>
            <MetaHead title={this.getTitle()}/>
            <AppLayout>
                <Content>
                    {this.renderCover()}
                    {this.renderTitle()}
                    {this.renderPage()}
                </Content>
            </AppLayout>
        </div>
    }

    private getTitle(): string {
        const properties = this.state.data[0].value.properties;
        return properties.title[0]
    }

    private renderCover(): React.ReactNode {
        const data = this.state.data[0];
        if (data === undefined || data == null) {
            return null;
        }
        const item = data.value;
        const format = item.format;
        if (format === undefined || format.page_cover === undefined || format.page_cover.length === 0) {
            return null;
        }
        const getRealImageUrl = (url: string): string => {
            if (url.startsWith("/")) {
                return "https://www.notion.so" + url;
            } else {
                return url;
            }
        };

        const coverUrl = getRealImageUrl(format.page_cover);
        // const pageCoverPosition = format.page_cover_position === undefined ? 0 : format.page_cover_position;
        return <CoverImage src={coverUrl}/>
    }

    private renderTitle(): React.ReactNode {
        const titleBlock = this.state.data[0].value;
        return <PageHeaderBlock value={titleBlock}/>
    }

    private renderPage(): React.ReactNode {
        const blockData = this.state.data[0].children;
        return <div><NotionBlockList blocks={blockData}/></div>;
    }
}