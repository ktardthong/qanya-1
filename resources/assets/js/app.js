angular.module('App')



    /**
     * App controller
     * */
    .controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $http, $translate) {

        var appCtrl = this;

        appCtrl.getChannels = function()
        {
            $http.get('/channel')
            .success(function(response){
                appCtrl.channnels = response;
            })
        }

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
    .controller('UserCtrl',function($mdDialog, $http, $scope, $log, $window, $translate,toastr) {
        var userCtrl = this;
        var originatorEv;

        /* Init vars */
        userCtrl.channelVisible     = false;
        userCtrl.expertsVisible     = false;
        userCtrl.profileCardVisible = false;

        userCtrl.tagExpertiseList = []; //from init
        userCtrl.expertiseArray = {};
        userCtrl.keys = [188];  //comma
        userCtrl.pwdForm = {};
        userCtrl.editForm = {};
        userCtrl.isloading = false;
        userCtrl.cardEnter = 'md-padding animated  rotateInDownRight';
        userCtrl.cardLeave = 'animated rotateOutUpLeft';
        //--- end var ---

        /**
         * Check user name
         * */
        userCtrl.checkUserName = function () {
            userCtrl.isloading = true;
            $http.post('/checkName', {
                    name: userCtrl.username
            })

            .success(function (response) {
                console.log(response);
                userCtrl.nameVerified = true;
                userCtrl.isloading = false;
                return response;
            })
        }


        userCtrl.isUsername = function(username)
        {
            console.log(username);
            if(username){
                userCtrl.channelVisible = true;
            }
        }


        /**
         * Save username
         * */
        userCtrl.saveUsername = function()
        {
            $http.post('/saveName', { name: userCtrl.username })
            .success(function (response) {
                userCtrl.channelVisible = true
                return response;
            })
        }

        /**
         * Save channel
         */
        userCtrl.saveChannel = function ()
        {
            $http.post('/saveChannel', { channels: userCtrl.channelSelect })
            .success(function (response) {
                userCtrl.expertsVisible = true;
                return response;
            })
        }


        /**
         * Open the menu windows
         */
        userCtrl.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        /**
         * List user expertise
         **/
        userCtrl.expertiseList = function(uuid){
            $http.post('/listExpertise',{ uuid: uuid})
            .success(function(response){
                console.log(response);
                userCtrl.expertiseArray = response;
                return response;
            })
        }


        userCtrl.expertAnswerList = function(tag)
        {
            console.log(tag + 'test answerlist')
            angular.forEach(userCtrl.expertiseArray, function(value, key) {
                console.log(value + key);
            });

        }


        /**
         * Adding expertise tags as array
         * */
        userCtrl.addExpertiseList = function()
        {
            $http.post('/addExpertiseList',{
                    expertiseList:      userCtrl.tagExpertiseList
                })
                .success(function(response){
                    console.log(response);
                    return response;
                })
        }

        /**
         * Update text description for user expertise
         * */
        userCtrl.updateExpertise = function(key,title)
        {
            toastr.info("saving...");
            $http.post('/updateExperienceText',{
                    title:  title,
                    text:   userCtrl.expText[key]
                })
                .success(function(response){
                    toastr.success('saved');
                    return response;
                })
        }

        /**
         * Addiing experise as single string
         */
        userCtrl.addExpertise = function(uuid)
        {
            userCtrl.expertiseArray.push(
                {"id":1,"user_uuid":"b626c4e8-bcf7-5153-ab57-49de0b60eb98","slug":"","title":"<p>php<\/p>","text":null,"endorsed":0,"flg":1,"created_at":"2016-06-17 06:49:41","updated_at":null}
            );
            console.log(userCtrl.expertiseArray);
            $http.post('/addExpertise',{
                    uuid: uuid,
                    expertise:      userCtrl.expertise,
                    expertise_body: userCtrl.expertise_body
            })
            .success(function(response){
                console.log(response);
                userCtrl.expertiseArray = [];
                userCtrl.expertiseArray = response;
                console.log(userCtrl.expertiseArray);
                return response;
            })
        }


        /**
         * Add new profile image
         * */
        userCtrl.addProfileImage = function(files)
        {
            angular.forEach(files, function(flowFile, i){
                var fileReader = new FileReader();
                fileReader.onload = function (event) {
                var uri = event.target.result;

                    toastr.info('Saving...!')

                    $http.post("/uploadAvatar", { data: uri} )
                        .success(function( response ) {
                            $('#profilePhoto').attr( "src", response);
                            toastr.success('Save!');
                        });
                };
                fileReader.readAsDataURL(flowFile.file);
            });
        }

        /**
         * Update user info
         * */
        userCtrl.updateInfo = function()
        {
            toastr.info('Saving...!')

            $http.post('/updateUserInfo',{ data: userCtrl.editForm })
            .success(function(response){
                toastr.success('Save!');
            })
        }

        /**
         * Update user's password here
         */
        userCtrl.changePass = function()
        {
            toastr.info('Saving...!')

            $http.post('/updatePassword',{ data: userCtrl.pwdForm })
                .success(function(response){
                    toastr.success('Save!');
                })
        }

    })


    /**
     * Question Controller
     * */
    .controller('QuestionCtrl',function($http, $log, $window, $translate, $location) {

        var questionCtrl = this;


        // Any key code can be used to create a custom separator
        questionCtrl.keys = [188]; //Comma
        questionCtrl.tags = [];
        questionCtrl.upvoteListing = [];
        questionCtrl.downvoteListing = [];
        questionCtrl.voteTally = [];

        /**
         * Default value set here
         *
         **/
        questionCtrl.upvoteStatusText   = false;
        questionCtrl.followStatusText   = false;
        questionCtrl.downvoteStatusText = false;


        questionCtrl.getExpertiseTag = function(tags)
        {
            console.log(tags);

            $http.post('/getExpertTags', { tags: tags})
            .success(function(response){
                console.log(response);
            })
        }

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
                                        text:   questionCtrl.questionDetail,
                                        anon:   questionCtrl.question_anon,
                                        tags:   questionCtrl.tags,
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
                                    topic:  topic_uuid,
                                    text:   questionCtrl.answer_text,
                                    uExp:   questionCtrl.userExpertId
            })
            .success(function(response){
                questionCtrl.answer_text        =   null;
                questionCtrl.answerBtnStatus    =   false;
                console.log('/answer/'+response);
                $window.location.href = '/answer/'+response;
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
         * Calculate the tally value
         */
        questionCtrl.voteTallyCalc = function(upvote,downvote,topic_uuid)
        {
            questionCtrl.voteTally[topic_uuid] = upvote - downvote;
        }

        /**
         * Determine if button should be highlight
         * */
        questionCtrl.voteHighlight = function(topic_uuid,voteActivity)
        {
            if(voteActivity == 1)
            {
                questionCtrl.upvoteListing[topic_uuid] = 'green-font-1';
            }
            else if(voteActivity == 2)
            {
                questionCtrl.downvoteListing[topic_uuid] = 'green-font-1';
            }

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




    })


    //Answer Controller
    .controller('AnswerCtrl',function($http, $log, $window, $translate) {
        var answerCtrl = this;

        /*INIT VALUES*/
        answerCtrl.upvoteStatusClass    =   [];
        answerCtrl.downvoteStatusClass  =   [];
        answerCtrl.answerReplyArr       =   [];
        //END

        /**
         * Upvote answer
         */
        answerCtrl.upvote = function(answer_uuid)
        {
            $http.post('/upvoteAnswer',{
                    answer: answer_uuid
                })
                .success(function(response) {
                    answerCtrl.upvoteClass(response,answer_uuid);
                })
        }

        /**
         * Downvote answer
         */
        answerCtrl.downvote = function(answer_uuid)
        {
            $http.post('/downvoteAnswer',{
                    answer: answer_uuid
                })
                .success(function(response) {
                    console.log(response);
                    answerCtrl.downvoteClass(response,answer_uuid);
                })
        }


        answerCtrl.downvoteClass = function(data,answer_uuid)
        {
            if(data == 4)
            {
                answerCtrl.downvoteStatusClass[answer_uuid] = 'green-font';
            }
            else
            {
                answerCtrl.downvoteStatusClass[answer_uuid] = '';
            }
        }


        answerCtrl.upvoteClass = function(data,answer_uuid)
        {
            if(data == 3)
            {
                answerCtrl.upvoteStatusClass[answer_uuid] = 'green-font';
            }
            else
            {
                answerCtrl.upvoteStatusClass[answer_uuid] = '';
            }
        }


        //Comment on answer
        answerCtrl.commentAnswer = function(answer_uuid)
        {
            $http.post('/commentAnswer',{
                    topic: answer_uuid,
                    body:  answerCtrl.answer_comment
                })
                .success(function(response){
                    answerCtrl.answerReplyArr[answer_uuid] = response;
                    answerCtrl.answer_comment = '';
                })
        }

        /**
         * Get the listing reply from answers
         */
        answerCtrl.fetchAnswerReply= function (answer_uuid)
        {
            $http.post('/answerReplyListing',{
                    answer_uuid: answer_uuid
                })
                .success(function(response) {
                    answerCtrl.answerReplyArr[answer_uuid] = response;
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