import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

interface SectionProps{
    bgColor?: string;
    noGutters?: boolean;
}
export class Section extends React.Component<SectionProps>{
    constructor(props:SectionProps){
        super(props)
    }
    render(){
        const color:string = (this.props as any).bgColor;
        const sectionCss: React.CSSProperties={
            backgroundColor: color ,
            zIndex: 1
        }

        return(
            <Container fluid style={sectionCss} className="d-flex bg-light">
                <Container className="d-flex pt-5 pb-4 border-bottom border-primary">
                    <Row className={"m-auto" + (this.props.noGutters? ' no-gutter': '')}>
                        {this.props.children}
                    </Row>
                </Container>
            </Container>
            
        )
    }
}