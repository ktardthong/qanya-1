<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Facades\DB;

class Question extends Model
{

    /**
     * Get User up vote status
     *
     * @param
     * @return int
     **/
    public function upvoteStatus($user_id,$topic_id)
    {
        $is_voted = DB::table('user_vote')
            ->where('user_uuid', $user_id)
            ->where('topic_uuid',$topic_id)
            ->where(['activity' => 1])
            ->first();

        return $is_voted;
    }


    /**
     * Get User down vote status
     *
     * @param
     * @return int
     **/
    public function downvoteStatus($user_id,$topic_id)
    {
        $is_voted = DB::table('user_vote')
            ->where('user_uuid', $user_id)
            ->where('topic_uuid',$topic_id)
            ->where(['activity' => 0])
            ->first();

        return $is_voted;
    }

    /**
     * Get User follow status
     *
     * @param
     * @return int
     **/
    public function followingStatus($user_id,$topic_id)
    {
        $is_following = DB::table('topics_follow')
                        ->where('uuid',$user_id)
                        ->where('topic_id',$topic_id)
                        ->where('flg',1)
                        ->first();
        return $is_following;
    }
}