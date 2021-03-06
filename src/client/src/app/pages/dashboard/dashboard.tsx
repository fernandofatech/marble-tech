import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Loading } from '../../../lib/components/loading/loading';
import { Ranking } from '../../../lib/components/ranking/ranking';
import { ChallengesUser } from '../../../lib/components/challengesUser/challengesUser';
import { UserService } from '../../../services/UserService';
import { UserProfile } from '../../../lib/components/userProfile/userProfile';
import { AuthService } from '../../../services/AuthService';
import { setAuthToken } from '../../../lib/components/withAuth/withAuth';
import { getToken } from '../../../helpers/authGuard';

interface DashboardProps{
    location?: any;
    history?:any;
    match?:any;
}
interface DashboardState{
    error: string | null;
    pageLoading: boolean;
    userId: number;
    userDetails: any | null;
    rank: any[];
    userChallenges: any[];
}

const userService:UserService = new UserService;
const authService: AuthService = new AuthService;

export class Dashboard extends Component<DashboardProps,DashboardState>{
    public constructor(props: DashboardProps) {
        super(props);
        this.state = {
            error:null,
            pageLoading:false,
            userId: 1,
            userDetails: null,
            rank : [],
            userChallenges : [],
        };
        
    }
    private _renderUserProfile(){
        if(this.state.userDetails){
        return <UserProfile user={ this.state.userDetails } {...this.props} onUpdate={this._loadData.bind(this)}/>
        }
        return <div></div>
    }
    private _loadData(){
        this.setState({pageLoading: true});
        (async () => {

            const loggedUser = await authService.authUser();
            this.setState({userDetails: loggedUser});

            await userService.getRank(6)
                .then((res:any)=>{
                    this.setState({rank:res})
                })
            await userService.getChallenges(this.state.userId)
                .then((res:any)=>{
                    this.setState({userChallenges:res})
                })
            this.setState({pageLoading: false})
            await setAuthToken(getToken());
        })();
    }
    componentDidMount() {
        this._loadData();
    }
    render(){
        const { rank, userChallenges } = this.state;
        return (
            <Container className="pb-5">
                <Row>
                <Col md={9}>
                    { this._renderUserProfile() }
                </Col>
                <Col md={3} >
                    <Ranking rankList={rank} />
                </Col>
                </Row>
                <Row>
                    <Col>
                        <ChallengesUser challengesUser={userChallenges}/>
                    </Col>
                </Row>    

                
                <Loading show={this.state.pageLoading}/>
            </Container>
        )
    }
}