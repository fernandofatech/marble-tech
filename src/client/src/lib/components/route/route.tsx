import React from 'react';
import {  Route as ReactRoute, Redirect, RouteComponentProps } from 'react-router-dom';
import * as authGuard from '../../../helpers/authGuard';
import { NotFound } from '../../../app/pages/notFound/notFound';

interface ProtectedRouteProps {
    component: JSX.Element,
    path?: string,
    isProtected?:boolean; 
    exact?:boolean;
}

export class Route extends React.Component<ProtectedRouteProps>{
    constructor(props:ProtectedRouteProps){
        super(props)
    }
    render(){
        const { component, isProtected, ...rest } = this.props;
        if(!!isProtected){
            return ( 
                <ReactRoute 
                    {...rest}
                    render={props =>
                    authGuard.loggedIn() ? (
                        React.cloneElement(component, props={...props})
                    ) : (
                        <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                        />
                    )
                    }
                />
                );
        
        }else{
            return (
                    <ReactRoute 
                    {...rest}
                    render={props =>React.cloneElement(component, props={...props})}/>
                
            );
        }
        
    }
}
