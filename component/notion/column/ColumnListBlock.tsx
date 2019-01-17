import * as React from 'react'
import styled from "styled-components";
import {BlockNode} from "../../../api/types";
import ColumnBlock from "./ColumnBlock";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
`;

const ColumnContainer = styled.div<{ ratio: number | undefined }>`
  flex-grow: 0; 
  flex-shrink: 0; 
  width: calc((100% - 92px) * ${p => p.ratio ? p.ratio : 1});
`;

const Gap = styled.div`
    width: 40px; 
    flex-grow: 0; 
    flex-shrink: 0; 
    transition: opacity 200ms ease-out 0s; 
    opacity: 0;
    position: relative;
`;

interface Props {
    block: BlockNode
}

class ColumnListBlock extends React.Component<Props, {}> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        const content: React.ReactNode[] = [];
        this.props.block.children.forEach((v, k) => {
            if (v.value.type === 'column') {
                if (k > 0) {
                    content.push(<Gap key={k * 2 - 1}/>)
                }
                const ratio: number | undefined = v.value.format ? v.value.format.column_ratio : undefined;
                content.push(
                    <ColumnContainer ratio={ratio} key={k * 2}>
                        <ColumnBlock block={v}/>
                    </ColumnContainer>
                )
            }
        });

        return <Container>
            {content}
        </Container>
    }
}

export default ColumnListBlock