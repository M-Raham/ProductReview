@echo off
cd /d "d:\ProductReview\backend"
bundle exec rails runner "Rails.application.config.generate_scheduled_reviews.call"
