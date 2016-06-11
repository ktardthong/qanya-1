angular.module('App')

    .filter('htmlToPlaintext', function() {
        return function(text) {
            return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };
    })

    /**
     * App controller
     * */
    .controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log, $translate) {

        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');
        $scope.isOpenRight = function () {
            return $mdSidenav('left').isOpen();
        };

        function buildToggler(navID) {
            return function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle();
            }
        }
    })


    /**
     * User Controller
     * */
    .controller('UserCtrl',function($http, $scope, $log, $window, $translate) {
        var userCtrl = this;

        //userCtrl.expertiseArray = [];


        /**
         * List user expertise
         **/
        userCtrl.expertiseList = function(uuid){
            $http.post('/listExpertise',{ uuid: uuid})
            .then(function(response){
                console.log(response);
                userCtrl.expertiseArray = response.data;
            })
        }



        /**
         *
         */
        userCtrl.addExpertise = function(uuid)
        {
            $http.post('/addExpertise',{
                    uuid: uuid,
                    expertise:      userCtrl.expertise,
                    expertise_body: userCtrl.expertise_body
            })
            .then(function(response){
                console.log(response);
                userCtrl.expertiseArray = response.data;
            })
        }

    })


    /**
     * Question Controller
     * */
    .controller('QuestionCtrl',function($http, $log, $window, $translate) {

        var questionCtrl = this;


        // Any key code can be used to create a custom separator
        questionCtrl.keys = [188]; //Comma
        questionCtrl.tags = [];


        /**
         * Default value set here
         *
         **/
        questionCtrl.upvoteStatusText   = false;
        questionCtrl.followStatusText   = false;
        questionCtrl.downvoteStatusText = false;


        /**
         * Pass the upvote count to ng
         * */
        questionCtrl.getUpvoteCount = function(count)
        {
            questionCtrl.upvoteCount = count
        }


        /**
         * Pass the downvote count to ng
         * */
        questionCtrl.getDownvoteCount = function(count)
        {
            questionCtrl.downvoteCount = count
        }


        //Submit question
        questionCtrl.q_submit = function()
        {
            $http.post('/question', {
                                        topic:  questionCtrl.question_topic,
                                        channel:questionCtrl.question_channel,
                                        anon:   questionCtrl.question_anon,
                                        tags: questionCtrl.tags,
            })
            .then(function(response){
                console.log(response);
                /*if(response.status == 200){
                    $window.location.href = '/';
                }*/
                console.log(response.status)
            })
        }


        //Submit answer
        questionCtrl.answer_submit = function(topic_uuid)
        {
            $http.post('/answer', {
                                    topic: topic_uuid,
                                    text:   questionCtrl.answer_text
            })
            .then(function(response){
                questionCtrl.answer_text        =   null;
                questionCtrl.answerBtnStatus    =   false;
                console.log(response);
            })
        }


        //Save user expertise
        questionCtrl.userExpertiseSave = function()
        {
            console.log(questionCtrl.userExpertTopic + questionCtrl.userExpertTopicText);
        }


        /**
         * User follow question
         */
        questionCtrl.followQuestion = function(topic_uuid)
        {
            $http.post('/followQuestion',{
                                            topic: topic_uuid
            })
            .then(function(response){
                console.log(response);
                if(response.data == 1){
                    questionCtrl.followStatusText = true;
                }else{
                    questionCtrl.followStatusText = false;
                }
            })
        }


        /**
         * Follow status
         * */
        questionCtrl.getFollowStatus = function(topic_uuid)
        {
            $http.post('/followStatus',{
                    topic: topic_uuid
                })
                .then(function(response){
                    console.log(response);
                    if(response.data == 1){
                        questionCtrl.followStatusText = true;
                    }else{
                        questionCtrl.followStatusText = false;
                    }
                })
        }


        /**
         * Up vote status
         *
         */
        questionCtrl.upvoteStatus = function(topic_uuid)
        {
            $http.post('/upvoteStatus',{
                    topic: topic_uuid
            })
            .then(function(response){

                if(response.data == 1)
                {
                    questionCtrl.upvoteStatusText = true

                }else{

                    questionCtrl.upvoteStatusText =  false

                }

            })
        }


        /**
         * Down Vote status
         * */
        questionCtrl.downvoteStatus = function(topic_uuid)
        {
            $http.post('/downvoteStatus',{
                    topic: topic_uuid
                })
                .then(function(response){

                    if(response.data == 1)
                    {
                        questionCtrl.downvoteStatusText = true

                    }else{

                        questionCtrl.downvoteStatusText =  false

                    }

                })
        }


        /**
         * Up vote question
         * @Event Click
         * */
        questionCtrl.questionUpvote = function(topic_uuid)
        {
            $http.post('/upvoteQuestion',{
                    topic: topic_uuid
            })
            .then(function(response){
                console.log(response);
                if(response.data == 1)
                {
                    questionCtrl.upvoteStatusText = true;
                    questionCtrl.downvoteStatusText = false;
                    questionCtrl.upvoteCount = questionCtrl.upvoteCount + 1;
                }else{
                    //Prevent the highlight status to trigger
                    if(questionCtrl.downvoteStatusText == false)
                    {
                        questionCtrl.downvoteStatusText = false;
                    }else
                    {
                        questionCtrl.downvoteStatusText = true;
                    }
                    questionCtrl.upvoteStatusText = false;
                    questionCtrl.upvoteCount = questionCtrl.upvoteCount - 1 ;
                }
            })
        }


        /**
         * Down vote question
         * @Event Click
         * */
        questionCtrl.questionDownvote = function(topic_uuid)
        {
            $http.post('/downvoteQuestion',{
                    topic: topic_uuid
                })
                .then(function(response){
                    console.log(response);
                    if(response.data == 1)
                    {
                        questionCtrl.upvoteStatusText = false;
                        questionCtrl.downvoteStatusText = true;
                        questionCtrl.downvoteCount = questionCtrl.downvoteCount+ 1;
                    }else{
                        //Prevent the highlight status to trigger
                        if(questionCtrl.upvoteStatusText == false)
                        {
                            questionCtrl.upvoteStatusText = false;
                        }else
                        {
                            questionCtrl.upvoteStatusText = true;
                        }
                        questionCtrl.downvoteStatusText = false;
                        questionCtrl.downvoteCount = questionCtrl.downvoteCount - 1 ;
                    }
                })
        }


        //Comment on answer
        questionCtrl.commentAnswer = function(topic_answers_uuid)
        {
            $http.post('/commentAnswer',{
                    topic: topic_answers_uuid,
                    body:   questionCtrl.answer_comment
            })
            .then(function(response){
                console.log(response);
            })
        }

    })


    //Answer Controller
    .controller('AnswerCtrl',function($http, $log, $window, $translate) {
        var answerCtrl = this;

        answerCtrl.upvoteStatusText = [];

        answerCtrl.upvote = function(answer_uuid)
        {
            $http.post('/upvoteAnswer',{
                    answer: answer_uuid
            })
            .then(function(response) {
                console.log(response);
            })
        }

        /**
         * Get vote status on this answer
         * */
        answerCtrl.getAnswerStatus = function(topic_uuid, index)
        {
            $http.post('/upvoteAnswerStatus',{
                    answer: topic_uuid
                })
                .then(function(response){

                    if(response.data == 1)
                    {
                        answerCtrl.upvoteStatusText[index] = true

                    }else{

                        answerCtrl.upvoteStatusText[index] =  false

                    }

                })
        }
    })
//# sourceMappingURL=all.js.map