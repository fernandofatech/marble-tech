import React from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import { Hero } from '../../../lib/components/hero/hero';
import { Section } from '../../../lib/components/section/section';
import Col from 'react-bootstrap/Col';
import { Login } from '../../../lib/components';

export class Home extends React.Component{
    render(){

        const {history}:any = this.props;
        return (
            <Container fluid className="bg-light px-0">
                <Hero><Login history={history}/></Hero>
                <Container fluid >
                    <Section>
                        <Col>
                        <h3 >Lorem Ipsum</h3>
                        <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        </p>
                        </Col>
                        <Col>
                        <h3 >Lorem Ipsum</h3>
                        <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        </p>
                        </Col>
                        <Col>
                        <h3 >Lorem Ipsum</h3>
                        <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        </p>
                        </Col>
                    </Section>
                    <Section noGutters>
                        <Col className="text-center">
                        <h2 >Lorem Ipsum</h2>
                        <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </p>
                        </Col>
                    </Section>
                    <Section>
                        <Col className="text-center">
                            <Image src="./images/profileImage.svg" roundedCircle className="mb-3"/>
                            <h3>Fernando Marinho</h3>
                            <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            </p>
                        </Col>
                        <Col className="text-center">
                            <Image src="./images/profileImage.svg" roundedCircle className="mb-3" />
                            <h3>Gustavo Lessa</h3>
                            <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            </p>
                        </Col>
                        <Col className="text-center">
                            <Image src="./images/profileImage.svg" roundedCircle className="mb-3"/>
                            <h3>Lucival</h3>
                            <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            </p>
                        </Col>
                        <Col className="text-center">
                            <Image src="./images/profileImage.svg" roundedCircle className="mb-3"/>
                            <h3>Rafael Barros</h3>
                            <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            </p>
                        </Col>
                    </Section>
                </Container>
            </Container>
        )
    }
}