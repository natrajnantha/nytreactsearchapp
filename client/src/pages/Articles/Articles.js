import React, { Component } from "react";
import API from "../../utils/API";
import { Article } from "../../components/Article";
import Jumbotron from "../../components/Jumbotron";
import { H1, H3, H4 } from "../../components/Headings";
import { Container, Row, Col } from "../../components/Grid";
import { Panel, PanelHeading, PanelBody } from "../../components/Panel";
import { Form, Input, FormBtn, FormGroup, Label } from "../../components/Form";

export default class Articles extends Component {
  state = {
    topic: "",
    article_start_date: "",
    article_end_date: "",
    prevtopic: "",
    prevstart_date: "",
    prevend_date: "",
    results: [],
    noResults: false
  };

  saveArticle = article => {
    let newArticle = {
      date: article.pub_date,
      title: article.headline.main,
      url: article.web_url,
      summary: article.snippet
    };
    console.log(newArticle);
    //calling the API
    API.saveArticle(newArticle)
      .then(results => {
        let unsavedArticles = this.state.results.filter(
          article => article.headline.main !== newArticle.title
        );
        this.setState({ results: unsavedArticles });
      })
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    let { topic, article_start_date, article_end_date } = this.state;
    let query = { topic, article_start_date, article_end_date };
    this.getArticles(query);
  };

  getArticles = query => {
    this.setState({ results: [] });
    let { topic, article_start_date, article_end_date } = query;
    console.log("QUERY IS **** ");
    console.log(query);
    let queryUrl =
      "https://api.nytimes.com/svc/search/v2/articlesearch.json?sort=newest";
    let key = `&api-key=a3YQMe9GEkr3xS69e6JLXAHENyOclyT7`;

    if (topic.indexOf(" ") >= 0) {
      topic = topic.replace(/\s/g, "+");
    }
    console.log("Begin date" + article_start_date);
    console.log("End date " + article_end_date);
    if (topic) {
      queryUrl += `&fq=${topic}`;
    }
    if (article_start_date) {
      queryUrl += `&begin_date=${article_start_date}`;
    }
    if (article_end_date) {
      queryUrl += `&end_date=${article_end_date}`;
    }
    queryUrl += key;
    console.log(queryUrl);
    //calling the API
    API.queryNYT(queryUrl)
      .then(results => {
        console.log(results.data.response.docs);
        this.setState(
          {
            results: results.data.response.docs,
            topic: "",
            article_start_date: "",
            article_end_date: "",
            prevtopic: topic,
            prevend_date: article_end_date,
            prevstart_date: article_start_date
          },
          function() {
            console.log("DISPLAYING RESULT AFTER API CALL");
            console.log(this.state);
            this.state.results.length === 0
              ? this.setState({ noResults: true })
              : this.setState({ noResults: false });
          }
        );
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="sm-10" offset="sm-1">
            <Jumbotron>
              <H1 className="page-header text-center">
                New York Times Article Search
              </H1>
            </Jumbotron>
            <Panel>
              <PanelHeading>
                <H3>Search</H3>
              </PanelHeading>
              <PanelBody>
                <Form style={{ marginBottom: "30px" }}>
                  <FormGroup>
                    <Label htmlFor="topic">Topic:</Label>
                    <Input
                      onChange={this.handleInputChange}
                      name="topic"
                      value={this.state.topic}
                      placeholder="Topic"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="article_start_date">
                      Start Date (optional):
                    </Label>
                    <Input
                      onChange={this.handleInputChange}
                      type="date"
                      name="article_start_date"
                      value={this.state.article_start_date}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="article_end_date">
                      End Date (optional):
                    </Label>
                    <Input
                      onChange={this.handleInputChange}
                      type="date"
                      name="article_end_date"
                      value={this.state.article_end_date}
                    />
                  </FormGroup>
                  <FormBtn
                    disabled={!this.state.topic}
                    onClick={this.handleFormSubmit}
                    type="info"
                  >
                    Search
                  </FormBtn>
                </Form>
              </PanelBody>
            </Panel>
            {this.state.noResults ? (
              <H1>No matching articles found. </H1>
            ) : this.state.results.length > 0 ? (
              <Panel>
                <PanelHeading>
                  <H3>Results for Topic {this.state.prevtopic}</H3>
                </PanelHeading>
                <PanelBody>
                  {this.state.results.map((article, i) => (
                    <Article
                      key={i}
                      title={article.headline.main}
                      url={article.web_url}
                      summary={article.snippet}
                      date={article.pub_date}
                      type="Save"
                      onClick={() => this.saveArticle(article)}
                    />
                  ))}
                </PanelBody>
              </Panel>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}
