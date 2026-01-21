<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>حجز سيارة - تأجير سيارات كركوك</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #1a237e;
            --secondary: #0d47a1;
            --accent: #ff6f00;
            --light: #f5f7ff;
            --dark: #0d1b2a;
            --success: #2e7d32;
            --warning: #f57c00;
            --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            --card-hover: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Cairo', sans-serif;
            background-color: #f8fafc;
            color: #333;
            direction: rtl;
            line-height: 1.6;
        }
        
        /* ============ NAVBAR ============ */
        .navbar {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            padding: 1rem 0;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: white;
            font-size: 1.8rem;
            font-weight: 800;
        }
        
        .logo-icon {
            background: white;
            color: var(--primary);
            width: 45px;
            height: 45px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }
        
        .nav-links {
            display: flex;
            gap: 2.5rem;
            list-style: none;
        }
        
        .nav-links a {
            color: rgba(255, 255, 255, 0.9);
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            transition: all 0.3s;
        }
        
        .nav-links a:hover,
        .nav-links a.active {
            color: white;
            background: rgba(255, 255, 255, 0.15);
        }
        
        /* ============ HERO SECTION ============ */
        .hero {
            background: linear-gradient(rgba(13, 27, 42, 0.85), rgba(13, 27, 42, 0.9)), 
                        url('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80');
            background-size: cover;
            background-position: center;
            color: white;
            padding: 8rem 2rem 4rem;
            text-align: center;
            margin-top: 70px;
            position: relative;
        }
        
        .hero-content {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
            z-index: 2;
        }
        
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 800;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .hero p {
            font-size: 1.3rem;
            opacity: 0.9;
            margin-bottom: 2rem;
        }
        
        .booking-steps {
            display: flex;
            justify-content: center;
            gap: 3rem;
            margin-top: 3rem;
            flex-wrap: wrap;
        }
        
        .step {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
        
        .step-number {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 800;
            color: white;
        }
        
        .step.active .step-number {
            background: var(--accent);
            border-color: var(--accent);
        }
        
        .step-text {
            color: white;
            font-weight: 600;
        }
        
        /* ============ MAIN CONTENT ============ */
        .main-content {
            max-width: 1200px;
            margin: 3rem auto;
            padding: 0 2rem;
        }
        
        /* ============ SELECTED CAR SECTION ============ */
        .selected-car-section {
            background: white;
            border-radius: 20px;
            padding: 2.5rem;
            margin-bottom: 3rem;
            box-shadow: var(--card-shadow);
            border: 1px solid #e2e8f0;
        }
        
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 2px solid #f1f5f9;
        }
        
        .section-header h2 {
            color: var(--dark);
            font-size: 1.8rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .change-car-btn {
            background: #f1f5f9;
            color: var(--primary);
            border: 2px solid #cbd5e1;
            padding: 0.8rem 1.5rem;
            border-radius: 10px;
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s;
        }
        
        .change-car-btn:hover {
            background: var(--primary);
            color: white;
            border-color: var(--primary);
        }
        
        .selected-car-details {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 2rem;
            align-items: center;
        }
        
        .car-image-container {
            width: 300px;
            height: 200px;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .car-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .car-info {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .car-title h3 {
            font-size: 1.8rem;
            color: var(--dark);
            margin-bottom: 0.5rem;
        }
        
        .car-title p {
            color: #64748b;
            font-size: 1.1rem;
        }
        
        .car-specs {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
        }
        
        .spec {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 0.8rem;
            background: #f8fafc;
            border-radius: 10px;
        }
        
        .spec-icon {
            color: var(--primary);
            font-size: 1.2rem;
        }
        
        .spec-text {
            display: flex;
            flex-direction: column;
        }
        
        .spec-label {
            color: #64748b;
            font-size: 0.9rem;
        }
        
        .spec-value {
            color: var(--dark);
            font-weight: 700;
        }
        
        .car-price-badge {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
            padding: 0.8rem 1.5rem;
            border-radius: 10px;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-weight: 700;
            font-size: 1.2rem;
            margin-top: 1rem;
        }
        
        /* ============ BOOKING FORM ============ */
        .booking-form-section {
            background: white;
            border-radius: 20px;
            padding: 2.5rem;
            box-shadow: var(--card-shadow);
            margin-bottom: 3rem;
        }
        
        .form-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
        }
        
        .form-group label {
            font-weight: 700;
            color: var(--dark);
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            padding: 1rem 1.2rem;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-family: 'Cairo', sans-serif;
            font-size: 1rem;
            transition: all 0.3s;
            background: white;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            border-color: var(--secondary);
            outline: none;
            box-shadow: 0 0 0 3px rgba(13, 71, 161, 0.1);
        }
        
        .form-group.full-width {
            grid-column: 1 / -1;
        }
        
        .form-group textarea {
            min-height: 120px;
            resize: vertical;
        }
        
        .date-time-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        .location-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 0.5rem;
        }
        
        .location-option {
            padding: 1.5rem;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: center;
        }
        
        .location-option:hover {
            border-color: var(--secondary);
            background: #f0f7ff;
        }
        
        .location-option.selected {
            border-color: var(--secondary);
            background: #e3f2fd;
        }
        
        .location-icon {
            font-size: 2rem;
            margin-bottom: 0.8rem;
            color: var(--primary);
        }
        
        .location-title {
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: var(--dark);
        }
        
        .location-desc {
            color: #64748b;
            font-size: 0.9rem;
        }
        
        /* ============ EXTRAS SECTION ============ */
        .extras-section {
            background: white;
            border-radius: 20px;
            padding: 2.5rem;
            box-shadow: var(--card-shadow);
            margin-bottom: 3rem;
        }
        
        .extras-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 1.5rem;
        }
        
        .extra-option {
            padding: 1.5rem;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .extra-option:hover {
            border-color: var(--secondary);
            background: #f0f7ff;
        }
        
        .extra-option.selected {
            border-color: var(--secondary);
            background: #e3f2fd;
        }
        
        .extra-checkbox {
            width: 24px;
            height: 24px;
            border: 2px solid #cbd5e1;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            background: white;
        }
        
        .extra-option.selected .extra-checkbox {
            background: var(--secondary);
            border-color: var(--secondary);
        }
        
        .extra-content {
            flex: 1;
        }
        
        .extra-title {
            font-weight: 700;
            margin-bottom: 0.3rem;
            color: var(--dark);
        }
        
        .extra-price {
            color: var(--success);
            font-weight: 700;
            font-size: 1.1rem;
        }
        
        .extra-desc {
            color: #64748b;
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
        
        /* ============ SUMMARY SECTION ============ */
        .summary-section {
            background: white;
            border-radius: 20px;
            padding: 2.5rem;
            box-shadow: var(--card-shadow);
            margin-bottom: 3rem;
            border: 2px solid #e3f2fd;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 1.5rem;
        }
        
        .summary-item {
            padding: 1.5rem;
            background: #f8fafc;
            border-radius: 12px;
            border-right: 4px solid var(--secondary);
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 0.8rem 0;
            border-bottom: 1px dashed #e2e8f0;
        }
        
        .summary-row.total {
            border-bottom: none;
            border-top: 2px solid #e2e8f0;
            margin-top: 0.8rem;
            padding-top: 1.2rem;
            font-weight: 800;
            color: var(--dark);
            font-size: 1.2rem;
        }
        
        .summary-label {
            color: #64748b;
        }
        
        .summary-value {
            color: var(--dark);
            font-weight: 700;
        }
        
        .total-price {
            color: var(--accent);
            font-size: 1.3rem;
        }
        
        .terms-agreement {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin: 2rem 0;
            padding: 1.5rem;
            background: #fff8e1;
            border-radius: 12px;
            border-right: 4px solid var(--warning);
        }
        
        .terms-agreement input {
            width: 20px;
            height: 20px;
        }
        
        .terms-agreement label {
            color: #856404;
            font-weight: 600;
        }
        
        /* ============ ACTION BUTTONS ============ */
        .action-buttons {
            display: flex;
            justify-content: space-between;
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .btn {
            padding: 1.2rem 3rem;
            border-radius: 12px;
            font-family: 'Cairo', sans-serif;
            font-weight: 800;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            min-width: 200px;
            border: none;
            text-decoration: none;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
            flex: 1;
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(26, 35, 126, 0.25);
        }
        
        .btn-secondary {
            background: white;
            color: var(--primary);
            border: 2px solid var(--primary);
        }
        
        .btn-secondary:hover {
            background: var(--primary);
            color: white;
        }
        
        .btn-disabled {
            background: #cbd5e1;
            color: #64748b;
            cursor: not-allowed;
            opacity: 0.7;
        }
        
        /* ============ FOOTER ============ */
        .footer {
            background: var(--dark);
            color: white;
            padding: 4rem 2rem 2rem;
            margin-top: 5rem;
        }
        
        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 3rem;
        }
        
        .footer-section h3 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: white;
        }
        
        .footer-section p {
            color: #cbd5e1;
            margin-bottom: 1rem;
        }
        
        .contact-info {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            color: #cbd5e1;
        }
        
        .contact-icon {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .footer-bottom {
            text-align: center;
            padding-top: 3rem;
            margin-top: 3rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: #94a3b8;
        }
        
        /* ============ MODAL ============ */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .modal-content {
            background: white;
            border-radius: 20px;
            padding: 2.5rem;
            max-width: 500px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        
        .modal-close {
            position: absolute;
            top: 20px;
            left: 20px;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        
        .modal h3 {
            color: var(--primary);
            margin-bottom: 1rem;
        }
        
        /* ============ RESPONSIVE ============ */
        @media (max-width: 992px) {
            .form-grid {
                grid-template-columns: 1fr;
            }
            
            .selected-car-details {
                grid-template-columns: 1fr;
            }
            
            .car-image-container {
                width: 100%;
                max-width: 400px;
                margin: 0 auto;
            }
            
            .car-specs {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }
            
            .hero {
                padding: 7rem 1rem 3rem;
            }
 
